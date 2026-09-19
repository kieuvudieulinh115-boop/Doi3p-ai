import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for JSON parsing with sufficient capacity for uploaded images
app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/analyze-waste', async (req: Request, res: Response) => {
  try {
    const {
      objectName = '',
      materialPredicted = '',
      condition = 'uncertain',
      description = '',
      imageBase64,
      studentGuess,
    } = req.body;

    const conditionLabelMap: Record<string, string> = {
      clean: 'Sạch sẽ, khô ráo',
      dirty: 'Bẩn, dính tạp chất / dầu mỡ',
      has_content: 'Còn chất lỏng / thức ăn / đồ đọng bên trong',
      uncertain: 'Chưa xác định rõ tình trạng',
    };

    const studentConditionText = conditionLabelMap[condition] || condition;

    const promptText = `
Bạn là AI Giáo dục STEM phân tích phân loại rác cho học sinh THCS tại Việt Nam ("Học bằng quan sát và kiểm chứng").
Dữ liệu học sinh đã quan sát và cung cấp:
- Tên vật thể: "${objectName || 'Chưa cung cấp'}"
- Vật liệu học sinh dự đoán: "${materialPredicted || 'Chưa rõ'}"
- Tình trạng học sinh chọn: "${studentConditionText}"
- Mô tả chi tiết của học sinh: "${description || 'Không có thêm mô tả'}"
${
  studentGuess
    ? `- Dự đoán trước của học sinh (Bước 2):
      + Vật liệu em nghĩ: "${studentGuess.material || ''}"
      + Thùng em nghĩ nên bỏ: "${studentGuess.bin || ''}"
      + Lý do em nghĩ như vậy: "${studentGuess.reason || ''}"`
    : ''
}

NHIỆM VỤ CỦA BẠN:
Phân tích theo đúng 5 góc độ khoa học:
1. Vật thể: Tên định danh chính xác hoặc gợi ý nhận diện vật thể.
2. Vật liệu có khả năng: Nhựa (chú ý mã nhựa nếu biết như PET #1, HDPE #2), kim loại nhôm/sắt, giấy, xốp PS, hay hữu cơ...
3. Tình trạng: Phân tích thực trạng (còn nước, dính dầu, sạch rỗng...).
4. Cần hỏi thêm / Điểm cần kiểm chứng: Những câu hỏi phản biện khoa học (ví dụ: chai có sạch không? còn nước hay đã tráng ráo? có tách nắp/nhãn không? có phải nhựa tái chế được không?).
5. Quy định cần kiểm tra: Nhắc học sinh kiểm tra quy định cụ thể của trường hoặc địa phương (vì mỗi nơi có cơ sở thu gom khác nhau).
6. Gợi ý sơ bộ: Lời khuyên hành động thực tế (Ví dụ: "Chưa bỏ ngay vào thùng tái chế! Cần đổ hết nước, tráng sơ, bóp dẹp rồi mới đối chiếu quy định").

LƯU Ý CỐT LÕI:
- KHÔNG tự ý đưa ra kết luận phân loại vội vàng nếu thiếu dữ liệu (ví dụ nếu còn nước, tuyệt đối không được khuyên ném ngay vào thùng tái chế).
- Nếu không đủ dữ liệu để kết luận an toàn, hãy đặt mức độ tin cậy là "insufficient" hoặc "needs_check" và nêu rõ vì sao.
- Luôn khuyến khích học sinh là người kiểm tra và đưa ra quyết định cuối cùng.
- Trả về dạng JSON tuân thủ đúng cấu trúc.
`;

    const contentsPayload: any = [];

    // If student provided an image base64, include it for multimodal analysis
    if (imageBase64 && typeof imageBase64 === 'string') {
      const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const data = match[2];
        contentsPayload.push({
          inlineData: {
            mimeType,
            data,
          },
        });
      }
    }

    contentsPayload.push({
      text: promptText,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload.length === 1 ? contentsPayload[0].text : { parts: contentsPayload },
      config: {
        systemInstruction:
          'Bạn là hệ thống AI giáo dục hỗ trợ học sinh THCS học phân loại rác bằng phương pháp quan sát và kiểm chứng khoa học. Tuyệt đối không phán đoán bừa khi thiếu dữ kiện. Trả về định dạng JSON hợp lệ.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objectIdentified: {
              type: Type.STRING,
              description: 'Tên nhận diện vật thể ngắn gọn, chuẩn xác',
            },
            materialIdentified: {
              type: Type.STRING,
              description: 'Vật liệu có khả năng cao nhất cùng đặc điểm nhận diện',
            },
            conditionAssessed: {
              type: Type.STRING,
              description: 'Đánh giá tình trạng vật thể (sạch/bẩn/còn nước/hỗn hợp)',
            },
            questionsToClarify: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách 2-4 câu hỏi/điều cần học sinh kiểm tra thêm',
            },
            regulationsToCheck: {
              type: Type.STRING,
              description: 'Quy định trường học hoặc địa phương cần đối chiếu',
            },
            preliminaryAdvice: {
              type: Type.STRING,
              description: 'Gợi ý sơ bộ và các bước cần làm trước khi bỏ rác',
            },
            confidenceLevel: {
              type: Type.STRING,
              description: 'Một trong ba giá trị: "sufficient", "needs_check", "insufficient"',
            },
            isInsufficientData: {
              type: Type.BOOLEAN,
              description: 'True nếu dữ liệu quá ít hoặc không thể xác định an toàn',
            },
            notes: {
              type: Type.STRING,
              description: 'Lời khuyên giáo dục khoa học dành cho học sinh',
            },
          },
          required: [
            'objectIdentified',
            'materialIdentified',
            'conditionAssessed',
            'questionsToClarify',
            'regulationsToCheck',
            'preliminaryAdvice',
            'confidenceLevel',
            'isInsufficientData',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback in case of parse error
      parsedData = {
        objectIdentified: objectName || 'Vật thể đã quan sát',
        materialIdentified: materialPredicted || 'Chưa xác định chính xác',
        conditionAssessed: studentConditionText,
        questionsToClarify: [
          'Vật thể có sạch hay còn cặn chất bẩn dính vào?',
          'Bên trong có còn đọng nước hay thức ăn không?',
          'Quy định phân loại rác tại trường của em phân chia thành mấy thùng?',
        ],
        regulationsToCheck: 'Bảng quy định phân loại rác của nhà trường và địa phương',
        preliminaryAdvice: 'Cần kiểm tra kỹ tình trạng rác và làm rỗng sạch trước khi phân loại.',
        confidenceLevel: 'needs_check',
        isInsufficientData: false,
        notes: 'AI chỉ đưa ra gợi ý ban đầu, em hãy tự kiểm chứng thực tế.',
      };
    }

    // Ensure valid confidenceLevel
    if (!['sufficient', 'needs_check', 'insufficient'].includes(parsedData.confidenceLevel)) {
      parsedData.confidenceLevel = 'needs_check';
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-waste:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi gọi Gemini AI để phân tích.',
    });
  }
});

// Setup Vite development server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
