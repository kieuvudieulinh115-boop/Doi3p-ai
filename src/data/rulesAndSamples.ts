import { SampleWasteItem, SchoolRule, WasteCondition, BinType, ConfidenceLevel, RuleEngineResult } from '../types';

export const SAMPLE_WASTE_ITEMS: SampleWasteItem[] = [
  {
    id: 'sample-1',
    name: 'Chai nước khoáng nhựa',
    category: 'Đồ nhựa uống nước',
    defaultMaterial: 'Nhựa PET (số 1)',
    defaultCondition: 'has_content',
    description: 'Một chai nhựa trong suốt dung tích 500ml, bên trong còn khoảng một ít nước lọc, nắp nhựa còn gắn trên cổ chai.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    iconName: 'BottleWater',
    badge: 'Mẫu chai nhựa còn nước'
  },
  {
    id: 'sample-2',
    name: 'Hộp sữa tươi giấy tiệt trùng',
    category: 'Vỏ hộp đồ uống',
    defaultMaterial: 'Giấy phức hợp (Tetra Pak)',
    defaultCondition: 'has_content',
    description: 'Vỏ hộp sữa 180ml bằng giấy nhiều lớp tráng nhôm, bên trong còn sót vài giọt sữa chưa tráng sạch.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    iconName: 'Milk',
    badge: 'Mẫu hộp sữa cần tráng'
  },
  {
    id: 'sample-3',
    name: 'Hộp xốp đựng cơm dính dầu mỡ',
    category: 'Đồ ăn mang đi',
    defaultMaterial: 'Xốp PS (Polystyrene)',
    defaultCondition: 'dirty',
    description: 'Hộp cơm xốp màu trắng đã qua sử dụng, dính nhiều dầu mỡ xào và vụn thức ăn khó rửa sạch.',
    imageUrl: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=600&auto=format&fit=crop&q=80',
    iconName: 'Utensils',
    badge: 'Mẫu xốp dính dầu'
  },
  {
    id: 'sample-4',
    name: 'Lon nhôm nước ngọt',
    category: 'Kim loại / Lon đồ uống',
    defaultMaterial: 'Nhôm (Aluminium)',
    defaultCondition: 'clean',
    description: 'Lon nhôm đựng nước ngọt có ga đã được uống cạn hoàn toàn, sạch sẽ, không còn đọng nước.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    iconName: 'Can',
    badge: 'Mẫu lon nhôm sạch'
  },
  {
    id: 'sample-5',
    name: 'Vỏ chuối chín và bã trà',
    category: 'Rác thải nhà bếp',
    defaultMaterial: 'Chất hữu cơ tự nhiên',
    defaultCondition: 'clean',
    description: 'Vỏ chuối chín mềm và bã trà sau khi pha nước, dễ phân hủy sinh học tự nhiên.',
    imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&auto=format&fit=crop&q=80',
    iconName: 'Apple',
    badge: 'Mẫu rác hữu cơ'
  },
  {
    id: 'sample-6',
    name: 'Pin tiểu AA đã qua sử dụng',
    category: 'Chất thải điện tử',
    defaultMaterial: 'Hóa chất / Kim loại nặng (Alkaline/Lithium)',
    defaultCondition: 'uncertain',
    description: 'Hai viên pin tiểu AA đã hết điện từ điều khiển tivi, có chứa chì, thủy ngân và dung môi hóa học nguy hại.',
    imageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
    iconName: 'BatteryCharging',
    badge: 'Mẫu rác nguy hại'
  },
  {
    id: 'sample-7',
    name: 'Mẩu giấy bìa không rõ nguồn gốc',
    category: 'Vật thể lạ chưa xác định',
    defaultMaterial: 'Chưa xác định',
    defaultCondition: 'uncertain',
    description: 'Một mẩu vật thể nhăn nhúm, một nửa như bìa cứng một nửa tráng keo bóng, chưa rõ có sạch hay không.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    iconName: 'HelpCircle',
    badge: 'Mẫu thiếu dữ liệu'
  }
];

export const TEACHER_CONFIRMED_RULES: SchoolRule[] = [
  {
    id: 'RULE-01',
    materialPattern: 'Nhựa PET / Chai nhựa trong',
    conditionPattern: 'Sạch, rỗng khô',
    sampleRegulation: 'Tái chế đạt chuẩn',
    suggestedBin: 'recycle',
    binName: 'Thùng rác Tái chế (Màu trắng/vàng/xanh dương)',
    requiredPreActions: ['Tháo nắp nếu quy định địa phương yêu cầu', 'Bóp dẹp để tiết kiệm diện tích'],
    notes: 'Chai nhựa PET sạch và khô có thể tái sinh thành hạt nhựa nguyên sinh hoặc sợi dệt.'
  },
  {
    id: 'RULE-02',
    materialPattern: 'Nhựa PET / Chai nhựa',
    conditionPattern: 'Còn nước / Còn chất lỏng',
    sampleRegulation: 'Cần làm rỗng & làm sạch trước',
    suggestedBin: 'uncertain',
    binName: 'CHƯA BỎ NGAY – Cần xử lý trước',
    requiredPreActions: [
      'Đổ hết nước/chất lỏng ra bồn rửa',
      'Tráng sơ bằng nước nếu có đường hoặc cặn',
      'Để ráo nước rồi mới bỏ vào thùng Tái chế'
    ],
    notes: 'Chất lỏng còn sót lại sẽ làm ẩm mốc rác giấy xung quanh và gây mùi hôi trong thùng tái chế.'
  },
  {
    id: 'RULE-03',
    materialPattern: 'Đồ nhựa dính dầu mỡ / Hộp nhựa dơ bẩn',
    conditionPattern: 'Bẩn nhiều / Dính dầu mỡ',
    sampleRegulation: 'Rác còn lại / Không thể tái chế',
    suggestedBin: 'residual',
    binName: 'Thùng rác Còn lại (Màu xám/đen)',
    requiredPreActions: ['Gạt bỏ thức ăn thừa vào thùng hữu cơ (nếu có)', 'Đậy kín để tránh côn trùng'],
    notes: 'Nhựa dính dầu mỡ không thể tái chế theo dây chuyền thông thường vì chi phí tẩy rửa quá cao.'
  },
  {
    id: 'RULE-04',
    materialPattern: 'Xốp PS (Hộp cơm, chén dĩa xốp)',
    conditionPattern: 'Đã qua sử dụng / Bẩn',
    sampleRegulation: 'Rác còn lại',
    suggestedBin: 'residual',
    binName: 'Thùng rác Còn lại',
    requiredPreActions: ['Thu gọn, không bẻ vụn gây phân tán hạt vi nhựa'],
    notes: 'Xốp PS giòn, khó gom và giá trị tái chế cực thấp nên đa số địa phương xếp vào rác còn lại.'
  },
  {
    id: 'RULE-05',
    materialPattern: 'Vỏ hộp giấy nhiều lớp (sữa/nước ép)',
    conditionPattern: 'Sạch, tráng rỗng & ép dẹp',
    sampleRegulation: 'Tái chế chuyên biệt',
    suggestedBin: 'recycle',
    binName: 'Thùng rác Tái chế (hoặc điểm gom vỏ hộp)',
    requiredPreActions: ['Cắt góc hoặc mở tai nắp', 'Tráng sạch sữa bên trong', 'Ép dẹp hoàn toàn'],
    notes: 'Hộp giấy tiệt trùng có lớp nhôm và màng PE bảo vệ, có thể tách bột giấy làm bàn ghế sinh thái.'
  },
  {
    id: 'RULE-06',
    materialPattern: 'Lon kim loại / Nhôm / Sắt',
    conditionPattern: 'Sạch, rỗng',
    sampleRegulation: 'Tái chế kim loại',
    suggestedBin: 'recycle',
    binName: 'Thùng rác Tái chế',
    requiredPreActions: ['Đổ cặn nước', 'Có thể đạp bẹp lon để tiết kiệm thể tích'],
    notes: 'Nhôm và sắt có thể nấu chảy tái chế vô hạn lần mà không giảm chất lượng vật liệu.'
  },
  {
    id: 'RULE-07',
    materialPattern: 'Thức ăn thừa / Vỏ trái cây / Lá cây',
    conditionPattern: 'Tự nhiên / Dễ ôi thiu',
    sampleRegulation: 'Rác hữu cơ',
    suggestedBin: 'organic',
    binName: 'Thùng rác Hữu cơ (Màu xanh lá cây)',
    requiredPreActions: ['Loại bỏ túi nylon, tăm tre, thìa muỗng nhựa lẫn vào'],
    notes: 'Rác hữu cơ được chuyển đến nhà máy ủ phân compost hoặc sản xuất khí biogas.'
  },
  {
    id: 'RULE-08',
    materialPattern: 'Pin / Bóng đèn / Đồ điện tử cũ',
    conditionPattern: 'Mọi tình trạng',
    sampleRegulation: 'Rác thải nguy hại',
    suggestedBin: 'hazardous',
    binName: 'Thùng gom rác Nguy hại / Hộp pin học đường',
    requiredPreActions: ['Băng dính 2 đầu cực của pin', 'Bỏ vào hộp thu gom pin chuyên dụng của trường'],
    notes: 'Tuyệt đối KHÔNG bỏ pin chung với rác sinh hoạt vì nguy cơ cháy nổ và rò rỉ kim loại nặng ra đất, nước.'
  },
  {
    id: 'RULE-09',
    materialPattern: 'Không rõ / Vật liệu hỗn hợp phức tạp',
    conditionPattern: 'Không xác định / Thiếu thông tin',
    sampleRegulation: 'Không đủ dữ liệu',
    suggestedBin: 'uncertain',
    binName: 'CHƯA XÁC ĐỊNH (Cần kiểm tra thêm)',
    requiredPreActions: [
      'Quan sát kỹ ký hiệu tái chế (ví dụ số 1 PET, 2 HDPE, 5 PP)',
      'Hỏi thầy cô giáo bộ môn Sinh/Hóa hoặc người phụ trách vệ sinh trường',
      'Nếu vẫn không thể xác định và có khả năng gây bẩn, tạm để riêng hoặc bỏ thùng rác còn lại'
    ],
    notes: 'Quy tắc STEM cốt lõi: Khi chưa đủ dữ liệu thì không được đoán mò!'
  }
];

export const RULE_DISCLAIMER =
  'Quy định minh họa – cần được giáo viên/địa phương xác nhận trước khi sử dụng thực tế. Quy định phân loại rác có thể khác nhau tùy theo cơ sở vật chất xử lý tại từng trường học và tỉnh/thành phố.';

/**
 * Deterministic Rule Engine
 */
export function evaluateRuleEngine(
  objectName: string,
  material: string,
  condition: WasteCondition,
  aiClarifications: string[] = []
): RuleEngineResult {
  const combinedText = `${objectName} ${material}`.toLowerCase();

  // Pin / hazardous check
  if (combinedText.includes('pin') || combinedText.includes('battery') || combinedText.includes('ắc quy') || combinedText.includes('bóng đèn huỳnh quang')) {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-08')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Vật thể thuộc nhóm chất thải nguy hại do chứa hóa chất hoặc kim loại nặng.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'hazardous',
      confidence: 'sufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Organic check
  if (
    combinedText.includes('chuối') ||
    combinedText.includes('vỏ trái cây') ||
    combinedText.includes('thức ăn') ||
    combinedText.includes('cơm nguội') ||
    combinedText.includes('bã trà') ||
    combinedText.includes('lá cây') ||
    combinedText.includes('hữu cơ')
  ) {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-07')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Rác hữu cơ phân hủy sinh học, thích hợp làm phân vi sinh hoặc ủ mùn.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'organic',
      confidence: 'sufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Foam / Styrofoam PS check
  if (combinedText.includes('xốp') || combinedText.includes('polystyrene') || combinedText.includes('ps')) {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-04')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Hộp xốp PS đã qua sử dụng rất khó tái chế và giá trị thấp, nên xếp vào rác còn lại.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'residual',
      confidence: condition === 'dirty' ? 'sufficient' : 'needs_check',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Plastic with liquid / remaining content
  if (
    (combinedText.includes('chai') || combinedText.includes('nhựa') || combinedText.includes('pet')) &&
    (condition === 'has_content' || combinedText.includes('nước') || combinedText.includes('còn chất'))
  ) {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-02')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Chai nhựa vẫn còn chất lỏng bên trong. TUYỆT ĐỐI KHÔNG bỏ ngay vào thùng tái chế vì sẽ làm hỏng các loại rác giấy khác!',
      requiredActions: [
        'Bước 1: Đổ cạn hết nước ra bồn rửa tay hoặc chậu cây (nếu là nước lọc sạch).',
        'Bước 2: Kiểm tra chai có sạch không (nếu đựng nước ngọt có đường, hãy tráng sơ).',
        'Bước 3: Vặn nhẹ hoặc bóp dẹp thân chai, sau đó mới bỏ vào thùng Tái chế.'
      ],
      binRecommendation: 'uncertain',
      confidence: 'needs_check',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Clean Plastic
  if ((combinedText.includes('chai') || combinedText.includes('nhựa') || combinedText.includes('pet')) && condition === 'clean') {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-01')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Chai nhựa sạch và rỗng hoàn toàn, đủ tiêu chuẩn tái chế.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'recycle',
      confidence: 'sufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Dirty Plastic
  if ((combinedText.includes('chai') || combinedText.includes('nhựa') || combinedText.includes('túi')) && condition === 'dirty') {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-03')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Nhựa dính nhiều dầu mỡ/bụi bẩn không thể rửa sạch tại trường thì phải bỏ vào thùng rác còn lại.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'residual',
      confidence: 'sufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Metal / Can
  if (combinedText.includes('lon') || combinedText.includes('nhôm') || combinedText.includes('kim loại') || combinedText.includes('sắt')) {
    if (condition === 'has_content') {
      return {
        matchedRule: TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-06')!,
        status: 'partial',
        guidance: 'Lon kim loại có thể tái chế, nhưng cần đổ hết đồ uống bên trong trước.',
        requiredActions: ['Đổ hết nước ngọt ra ngoài', 'Bỏ lon vào thùng tái chế kim loại'],
        binRecommendation: 'uncertain',
        confidence: 'needs_check',
        disclaimer: RULE_DISCLAIMER
      };
    }
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-06')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Lon kim loại sạch, phân loại vào rác tái chế vô cơ.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'recycle',
      confidence: 'sufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Milk carton / Tetra Pak
  if (combinedText.includes('sữa') || combinedText.includes('tetra pak') || combinedText.includes('hộp giấy')) {
    if (condition === 'has_content') {
      return {
        matchedRule: TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-05')!,
        status: 'partial',
        guidance: 'Hộp sữa giấy còn đọng sữa: bắt buộc phải tráng sạch và ép dẹp trước khi bỏ thùng tái chế!',
        requiredActions: [
          'Dùng kéo hoặc tay mở bung 4 tai của vỏ hộp sữa',
          'Tráng nước sạch để tránh sữa ôi thiu bốc mùi',
          'Ép dẹp và xếp vào túi thu gom vỏ hộp sữa học đường'
        ],
        binRecommendation: 'uncertain',
        confidence: 'needs_check',
        disclaimer: RULE_DISCLAIMER
      };
    }
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-05')!;
    return {
      matchedRule: rule,
      status: 'matched',
      guidance: 'Vỏ hộp giấy đã làm sạch và ép dẹp, thuộc nhóm tái chế chuyên biệt.',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'recycle',
      confidence: 'sufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Condition is uncertain or material is unknown
  if (condition === 'uncertain' || material.toLowerCase().includes('chưa xác định') || material.toLowerCase().includes('không rõ')) {
    const rule = TEACHER_CONFIRMED_RULES.find(r => r.id === 'RULE-09')!;
    return {
      matchedRule: rule,
      status: 'uncertain',
      guidance: 'CHƯA XÁC ĐỊNH: Không đủ dữ liệu về vật liệu hoặc tình trạng để đưa ra kết luận an toàn. Không được cố đoán!',
      requiredActions: rule.requiredPreActions,
      binRecommendation: 'uncertain',
      confidence: 'insufficient',
      disclaimer: RULE_DISCLAIMER
    };
  }

  // Default fallback when not covered by sample table
  return {
    matchedRule: null,
    status: 'uncertain',
    guidance: 'Vật thể này chưa có trong bảng quy định mẫu tiêu chuẩn của trường. Cần kiểm tra bảng quy chế địa phương.',
    requiredActions: [
      'Xác định rõ loại vật liệu cấu thành (nhựa, giấy, kim loại hay hỗn hợp)',
      'Kiểm tra vật thể có sạch hay dính chất bẩn không',
      'Hỏi giáo viên hướng dẫn trước khi quyết định'
    ],
    binRecommendation: 'uncertain',
    confidence: 'needs_check',
    disclaimer: RULE_DISCLAIMER
  };
}
