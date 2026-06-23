import type { VnptDocumentation } from "@/types/documentation";

export const vnptDocumentation: VnptDocumentation = {
  title: "Tài liệu API Hóa đơn điện tử VNPT",
  version: "6.0",
  lastUpdated: "15/04",
  
  // 1. DANH MỤC NHÓM DỊCH VỤ (Mục lục) [1-4]
  serviceGroups: [
    { id: "basic-publish", name: "2.1. Nhóm tạo lập và phát hành hóa đơn (PublishService)", description: "Các hàm thực hiện nghiệp vụ khởi tạo, phát hành và quản lý chứng thư số cơ bản." },
    { id: "basic-portal", name: "2.2. Nhóm tra cứu hóa đơn (PortalService)", description: "Các hàm phục vụ tải hóa đơn (XML, PDF, HTML), tìm kiếm và chuyển đổi chứng minh nguồn gốc." },
    { id: "basic-business", name: "2.3. Nhóm xử lý hóa đơn (BusinessService)", description: "Các hàm nghiệp vụ gạch nợ, điều chỉnh, thay thế và hủy hóa đơn cơ bản." },
    { id: "tt78-publish", name: "3.1. Thông tư 78 - Phát hành (PublishService)", description: "Các hàm phát hành hóa đơn, gửi thông báo sai sót và đăng ký tờ khai theo chuẩn TT78/2021/TT-BTC." },
    { id: "tt78-business", name: "3.2. Thông tư 78 - Xử lý (BusinessService)", description: "Các hàm điều chỉnh, thay thế và quản lý biên bản điện tử theo chuẩn TT78." },
    { id: "ctt-service", name: "4. Chứng từ khấu trừ thuế TNCN", description: "Các hàm phát hành và xử lý chứng từ thuế TNCN điện tử." },
    { id: "mtt-service", name: "5. Máy tính tiền", description: "Các hàm tích hợp hóa đơn khởi tạo từ máy tính tiền có mã của CQT." }
  ],

  // 1.3. BẢNG MÃ LỖI HỆ THỐNG DÙNG CHUNG [1, 5, 6]
  globalErrors: [
    { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thực hiện nghiệp vụ [5]." },
    { code: "ERR:2", message: "Chuỗi token không đúng định dạng hoặc hóa đơn/fkey không tồn tại [7, 8]." },
    { code: "ERR:3", message: "Dữ liệu XML đầu vào không đúng quy định hoặc sai cấu trúc [5]." },
    { code: "ERR:4", message: "Không tìm thấy Pattern (Mẫu số) hoặc dải thông báo phát hành [7, 9]." },
    { code: "ERR:5", message: "Lỗi hệ thống không xác định (DB rollback / Exception) [5]." },
    { code: "ERR:6", message: "Dải hóa đơn không đủ số lượng hoặc không tìm thấy hóa đơn [5, 10]." },
    { code: "ERR:7", message: "Username/password không hợp lệ hoặc không tìm thấy thông tin công ty [5, 11]." },
    { code: "ERR:8", message: "Hóa đơn đã bị điều chỉnh, hủy, thay thế hoặc đã chuyển đổi [5, 12]." },
    { code: "ERR:9", message: "Trạng thái hóa đơn không được phép thực hiện nghiệp vụ (vd: Đã thanh toán không được hủy) [13]." },
    { code: "ERR:10", message: "Lô hóa đơn vượt quá số lượng tối đa cho phép (thường là 5000) [5, 11]." },
    { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem/tải được [7, 14]." },
    { code: "ERR:12", message: "Hóa đơn có mã chưa được Thuế chấp nhận hoặc ngày hóa đơn cũ không hợp lệ [7, 15]." },
    { code: "ERR:13", message: "Lỗi trùng Fkey (khóa hóa đơn đã tồn tại trên hệ thống) [5, 16]." },
    { code: "ERR:20", message: "Pattern và Serial không phù hợp hoặc không tồn tại [5, 6]." },
    { code: "ERR:29", message: "Chứng thư số hết hạn hoặc không tìm thấy keystore [5, 17]." },
    { code: "ERR:30", message: "Ngày hóa đơn truyền vào nhỏ hơn ngày hóa đơn đã phát hành gần nhất [5, 6]." },
    { code: "ERR:35", message: "Bắt buộc truyền Pattern và Serial (áp dụng khi dùng cả dải có mã và không mã) [5, 6]." },
    { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã) [18, 19]." }
  ],

  apis: [
    // --- CHƯƠNG 2.1: PUBLISH SERVICE (PHÁT HÀNH CƠ BẢN) ---
    {
      id: "import-and-publish-inv",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.1",
      name: "ImportAndPublishInv",
      description: "Phát hành hóa đơn với dữ liệu XML của khách hàng, tối đa cho 5000 hóa đơn.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn không đủ số hóa đơn cho lô phát hành" },
        { code: "ERR:7", message: "Thông tin về Username/pass không hợp lệ" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng cho phép" },
        { code: "ERR:13", message: "Lỗi trùng fkey" },
        { code: "ERR:20", message: "Pattern và Serial không phù hợp" },
        { code: "ERR:21", message: "Lỗi trùng số hóa đơn" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:35", message: "Bắt buộc truyền pattern, serial khi công ty đăng ký cả có mã và không mã" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><MCCQT></MCCQT><Invoice><CusCode>*</CusCode><CusName>*</CusName><CusAddress>*</CusAddress><CusTaxCode>*</CusTaxCode><PaymentMethod>*</PaymentMethod><Products><Product><ProdName>*</ProdName><ProdUnit>*</ProdUnit><ProdQuantity>*</ProdQuantity><ProdPrice>*</ProdPrice><Amount>*</Amount><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><IsSum>*</IsSum></Product></Products><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><Amount>*</Amount><AmountInWords>*</AmountInWords></Invoice></Inv></Invoices>`
    },
    {
      id: "import-and-publish-assigned-no",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.2",
      name: "ImportAndPublishAssignedNo",
      description: "Phát hành hóa đơn với dữ liệu XML của khách hàng cho phép truyền số hóa đơn khi phát hành, tối đa cho 5000 hóa đơn.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành hóa đơn thành công" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><Invoice><InvoiceNo>*</InvoiceNo><CusCode>*</CusCode><CusName>*</CusName><CusAddress>*</CusAddress><PaymentMethod>*</PaymentMethod><Products><Product><ProdName>*</ProdName><Amount>*</Amount><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><IsSum>*</IsSum></Product></Products><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><Amount>*</Amount><AmountInWords>*</AmountInWords></Invoice></Inv></Invoices>`
    },
    {
      id: "publish-inv-fkey",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.3",
      name: "PublishInvFkey",
      description: "Phát hành hóa đơn theo 1 danh sách fkey truyền vào, tối đa 200 fkey.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "lsFkey", type: "string", required: true, description: "Danh sách Fkey truyền vào được ngăn cách bởi dấu _" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" }
      ],
      responseParams: [
        { code: "OK:#Fkey1 _No1, Fkey2_No2...", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Danh sách Fkey không tồn tại" },
        { code: "ERR:10", message: "Danh sách Fkey truyền vào vượt quá 200 fkey" },
        { code: "ERR:15", message: "Danh sách Fkey đã phát hành" },
        { code: "ERR:20", message: "Pattern và Serial không phù hợp" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" }
      ],
      xmlTemplate: `<PublishInvFkey><Account>*</Account><ACpass>*</ACpass><lsFkey>*</lsFkey><username>*</username><password>*</password><pattern></pattern><serial></serial></PublishInvFkey>`
    },
    {
      id: "publish-inv-by-date",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.4",
      name: "PublishInvByDate",
      description: "Phát hành hóa đơn theo 1 khoảng thời gian truyền vào.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "FromDate", type: "string", required: true, description: "Ngày bắt đầu (so sánh với publishdate)" },
        { name: "ToDate", type: "string", required: true, description: "Ngày kết thúc (so sánh với publishdate)" }
      ],
      responseParams: [
        { code: "OK:#Fkey1 _No1, Fkey2_No2...", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền phát hành hóa đơn" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:14#", message: "Không phát hành được hóa đơn của công ty ứng với từng mẫu số, ký hiệu" },
        { code: "ERR:20", message: "Pattern và Serial không phù hợp" },
        { code: "ERR:23", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:24#", message: "Không tìm thấy hóa đơn cần phát hành" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" }
      ],
      xmlTemplate: `<PublishInvByDate><Account>*</Account><ACpass>*</ACpass><username>*</username><password>*</password><FromDate>*</FromDate><ToDate>*</ToDate></PublishInvByDate>`
    },
    {
      id: "get-hash-inv-with-token",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.5",
      name: "getHashInvWithToken",
      description: "Bước 1: Lấy giá trị Hash để ký số bằng token ở client.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "0: Mới, 1: Thay thế, 2: Tăng, 3: Giảm, 4: Thông tin" },
        { name: "invToken", type: "string", required: false, description: "Chuỗi token hóa đơn (khi thay thế/điều chỉnh)" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "XML", message: "Chuỗi XML trả về chứa giá trị hashValue tương ứng" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "publish-inv-with-token",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.6",
      name: "publishInvWithToken",
      description: "Bước 2: Phát hành hóa đơn với các hệ thống sử dụng token.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML chứa thẻ signValue" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Phát hành hóa đơn thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "adjust-replace-inv-with-token",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.7",
      name: "AdjustReplaceInvWithToken",
      description: "Thay thế, điều chỉnh hóa đơn cho các khách hàng sử dụng token.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "1: Thay thế, 2: Điều chỉnh tăng, 3: Điều chỉnh giảm, 4: Điều chỉnh thông tin" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Thay thế/điều chỉnh thành công" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue><LDo>*</LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh></Inv></Invoices>`
    },
    {
      id: "import-inv-by-pattern",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.8",
      name: "ImportInvByPattern",
      description: "Thêm mới hóa đơn theo mẫu số, ký hiệu.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành hóa đơn thành công" },
        { code: "ERR:22", message: "Trùng số hóa đơn" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><Invoice><CusCode>*</CusCode><CusName>*</CusName><CusAddress>*</CusAddress><CusTaxCode>*</CusTaxCode><PaymentMethod>*</PaymentMethod><Products><Product><ProdName>*</ProdName><ProdUnit>*</ProdUnit><ProdQuantity>*</ProdQuantity><ProdPrice>*</ProdPrice><Amount>*</Amount><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><IsSum>*</IsSum></Product></Products><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><Amount>*</Amount><AmountInWords>*</AmountInWords></Invoice></Inv></Invoices>`
    },
    {
      id: "update-cus",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.9",
      name: "UpdateCus",
      description: "Cập nhật dữ liệu khách hàng.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "xmlCusData", type: "string", required: true, description: "Dữ liệu khách hàng XML" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "N", message: "Số lượng khách hàng đã import và update" },
        { code: "-1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "-2", message: "Không import được khách hàng vào db" },
        { code: "-3", message: "Dữ liệu xml đầu vào không đúng quy định" }
      ],
      xmlTemplate: `<Customers><Customer><Name>*</Name><Code>*</Code><TaxCode>*</TaxCode><Address>*</Address><CusType>1:DN/0:CN</CusType></Customer></Customers>`
    },
    {
      id: "delete-invoice-by-fkey",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.10",
      name: "deleteInvoiceByFkey",
      description: "Xóa 1 hoặc nhiều hóa đơn chưa phát hành theo danh sách fkey truyền vào.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "lstFkey", type: "string", required: true, description: "Danh sách fkey cần xóa bỏ, phân cách bằng _" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" }
      ],
      responseParams: [
        { code: "OK:fkey1,fkey2", message: "Xóa hóa đơn thành công, trả về danh sách fkey" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai, hoặc không có quyền" },
        { code: "ERR:5", message: "Lỗi không xác định" },
        { code: "ERR:7", message: "Không tìm thấy công ty" },
        { code: "ERR:10", message: "Số hóa đơn truyền vào vượt quá số lượng cho phép" },
        { code: "ERR:20", message: "Pattern và Serial không hợp lệ" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "import-inv",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.11",
      name: "ImportInv",
      description: "Tạo mới hóa đơn từ chuỗi xml đầu vào theo chuẩn mô tả.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi xml chứa thông tin hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-invKeyList", message: "Tạo hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai" },
        { code: "ERR:3", message: "Định dạng xml của hóa đơn sai cấu trúc" },
        { code: "ERR:5", message: "Không tìm thấy công ty / Lỗi hệ thống" },
        { code: "ERR:6", message: "Không còn dư số hóa đơn để phát hành" },
        { code: "ERR:10", message: "Vượt quá số lượng hóa đơn tạo cho phép" },
        { code: "ERR:20", message: "Pattern và serial không hợp lệ" },
        { code: "ERR:35", message: "Bắt buộc truyền pattern, serial khi công ty đăng ký cả có mã và không mã" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><Invoice><CusCode>*</CusCode><CusName>*</CusName><CusAddress>*</CusAddress><CusTaxCode>*</CusTaxCode><PaymentMethod>*</PaymentMethod><Products><Product><ProdName>*</ProdName><ProdUnit>*</ProdUnit><ProdQuantity>*</ProdQuantity><ProdPrice>*</ProdPrice><Amount>*</Amount><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><IsSum>*</IsSum></Product></Products><Total>*</Total><VATRate>*</VATRate><VATAmount>*</VATAmount><Amount>*</Amount><AmountInWords>*</AmountInWords></Invoice></Inv></Invoices>`
    },
    {
      id: "send-again-email-serv",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.12",
      name: "SendAgainEmailServ",
      description: "Gửi lại email thông báo phát hành hóa đơn tới khách hàng.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên có quyền gửi mail" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "xmlDataInvoiceEmail", type: "string", required: true, description: "Thông tin hóa đơn cho nội dung gửi mail" },
        { name: "hdPattern", type: "string", required: true, description: "Mẫu số hóa đơn" },
        { name: "Serial", type: "string", required: true, description: "Ký hiệu hóa đơn" }
      ],
      responseParams: [
        { code: "OK", message: "Gửi thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai" },
        { code: "ERR:3", message: "Dữ liệu Pattern để trống" },
        { code: "ERR:4", message: "Không tìm được hóa đơn để tạo và gửi lại mail" },
        { code: "ERR:5", message: "Lỗi hệ thống" },
        { code: "ERR:6", message: "Không tìm thấy cấu hình IDeliver để tạo và gửi lại gửi mail" },
        { code: "ERR:7", message: "Không gửi được email nào thành công" },
        { code: "ERR:8", message: "Dữ liệu Fkey để trống trong chuỗi xml gửi lên" },
        { code: "ERR:9", message: "Dữ liệu Serial để trống" },
        { code: "ERR:10", message: "Số lượng fkey truyền vào lớn hơn giới hạn tối đa cho phép" },
        { code: "ERR:20", message: "Không tìm thấy thông báo phát hành hợp lệ" },
        { code: "ERR:21", message: "Không tìm được công ty, tài khoản không tồn tại" }
      ],
      xmlTemplate: `<Invoices><Inv><Fkey>*</Fkey><EmailDeliver>*</EmailDeliver></Inv></Invoices>`
    },
    {
      id: "get-cert-info",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.13",
      name: "GetCertInfo",
      description: "Lấy thông tin chứng thư số hiện tại của đơn vị.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Chuỗi base64 trả về của chuỗi XML thông tin chứng thư" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" }
      ],
      xmlTemplate: `<Certificate><OwnCA></OwnCA><SerialNumber></SerialNumber><ValidFrom></ValidFrom><ValidTo></ValidTo><OrganizationCA></OrganizationCA></Certificate>`
    },
    {
      id: "update-certificate",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.14",
      name: "UpdateCertificate",
      description: "Đăng ký/cập nhật loại hình ký số và chứng thư số của đơn vị.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "certinfo", type: "string", required: true, description: "Chuỗi thông tin chứng thư số" },
        { name: "serialCert", type: "string", required: true, description: "Serial chứng thư số" },
        { name: "certType", type: "int", required: true, description: "Loại hình ký số (4: token, 6: SmartCA)" },
        { name: "id", type: "int", required: false, description: "Giá trị id chứng thư số (=0 nếu là thêm mới)" }
      ],
      responseParams: [
        { code: "int", message: "Giá trị id chứng thư số trả về sau khi thực hiện thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:41", message: "Đã tồn tại chứng thư này trong hệ thống" },
        { code: "ERR:42", message: "Chứng thư đã đăng ký với thuế, không thể thay đổi" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "delete-certificate",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.15",
      name: "DeleteCertificate",
      description: "Xóa thông tin chứng thư số của đơn vị.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "id", type: "int", required: false, description: "Giá trị id chứng thư số cần xóa" }
      ],
      responseParams: [
        { code: "OK", message: "Thực hiện xóa thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:41", message: "Đã tồn tại chứng thư này trong hệ thống" },
        { code: "ERR:42", message: "Chứng thư đã đăng ký với thuế, không thể thay đổi" },
        { code: "ERR:43", message: "Chứng thư không phải của công ty" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-certificates",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.16",
      name: "GetCertificates",
      description: "Lấy thông tin danh sách chứng thư số hiện tại của đơn vị.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Chuỗi base64 trả về của chuỗi XML thông tin danh sách chứng thư" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" }
      ],
      xmlTemplate: `<Certificates><Certificate><OwnCA></OwnCA><SerialNumber></SerialNumber><ValidFrom></ValidFrom><ValidTo></ValidTo><OrganizationCA></OrganizationCA><Status></Status><CertType></CertType></Certificate></Certificates>`
    },
    {
      id: "reset-password",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.17",
      name: "resetPassword",
      description: "Thay đổi mật khẩu.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tên tài khoản đăng nhập vào hệ thống" },
        { name: "oldPass", type: "string", required: true, description: "Mật khẩu cũ" },
        { name: "newPass", type: "string", required: true, description: "Mật khẩu mới" }
      ],
      responseParams: [
        { code: "MSG_Update_002", message: "Thay đổi mật khẩu thành công." },
        { code: "MSG_Update_001", message: "Không tìm thấy thông tin tài khoản." },
        { code: "MSG_Update_003", message: "Mật khẩu mới không được trùng với mật khẩu cũ." },
        { code: "MSG_Update_004", message: "Mật khẩu cũ không chính xác." },
        { code: "MSG_Update_005", message: "Có lỗi xảy ra" },
        { code: "MSG_Update_006", message: "Mật khẩu không được để trống." }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "set-cccd-for-company",
      serviceGroupId: "basic-publish",
      sectionNumber: "2.1.18",
      name: "SetCCCDanForCompany",
      description: "Cập nhật CCCD người đại diện pháp luật đơn vị bán, sử dụng CCCD thay cho MST.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "CCCDan", type: "string", required: true, description: "Số CCCD 12 chữ số" },
        { name: "SuDungCCCD", type: "int", required: false, description: "1: Dùng thay MST, 0: Không dùng thay MST" }
      ],
      responseParams: [
        { code: "OK", message: "Cập nhật thông tin công ty thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai" },
        { code: "ERR:3", message: "CCCD không được để trống, hoặc độ dài CCCD không đúng" },
        { code: "ERR:5", message: "Lỗi hệ thống" },
        { code: "ERR:7", message: "Không tìm thấy user tương ứng trong công ty" },
        { code: "ERR:21", message: "Không tìm thấy công ty" }
      ],
      xmlTemplate: "N/A"
    },

    // --- CHƯƠNG 2.2: PORTAL SERVICE (TRA CỨU & DOWNLOAD) ---
    {
      id: "download-inv",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.1",
      name: "downloadInv",
      description: "Tải về chuỗi xml của hóa đơn.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy Pattern" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-no-pay",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.2",
      name: "downloadInvNoPay",
      description: "Tải về chuỗi xml của hóa đơn, cho phép tải các hóa đơn chưa thanh toán.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy Pattern" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.3",
      name: "downloadInvFkey",
      description: "Tải về chuỗi xml của hóa đơn theo fkey truyền lên.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-fkey-no-pay",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.4",
      name: "downloadInvFkeyNoPay",
      description: "Tải về chuỗi xml của hóa đơn theo fkey truyền lên, cho phép tải cả hóa đơn chưa thanh toán.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-new-inv-pdf-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.5",
      name: "downloadNewInvPDFFkey",
      description: "Tải về dạng pdf của hóa đơn mới tạo theo Fkey truyền lên.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Fkey truyền lên rỗng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-pdf",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.6",
      name: "downloadInvPDF",
      description: "Tải về dạng pdf của hóa đơn theo token truyền lên.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-pdf-fkey-no-pay",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.7",
      name: "downloadInvPDFFkeyNoPay",
      description: "Tải về dạng pdf của hóa đơn theo fkey truyền lên, cho phép tải cả hóa đơn chưa thanh toán.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "list-inv-from-no-to-no",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.8",
      name: "listInvFromNoToNo",
      description: "Trả về thông tin cơ bản của hóa đơn dạng chuỗi xml từ số hóa đơn đến số hóa đơn truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invFromNo", type: "string", required: true, description: "Số bắt đầu" },
        { name: "invToNo", type: "string", required: true, description: "Số kết thúc" },
        { name: "invPattern", type: "string", required: true, description: "Mẫu số" },
        { name: "invSerial", type: "string", required: true, description: "Ký hiệu" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_xml_trả_về", message: "Trả về chuỗi xml theo cấu trúc" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: `<Data><Item><index>*</index><invToken>*</invToken><fkey>*</fkey><name>*</name><publishDate>*</publishDate><signStatus>*</signStatus><total>*</total><amount>*</amount><pattern>*</pattern><serial>*</serial><invNum>*</invNum><status>*</status><cusname>*</cusname><payment>*</payment></Item></Data>`
    },
    {
      id: "list-inv-by-cus",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.9",
      name: "listInvByCus",
      description: "Trả về thông tin cơ bản của hóa đơn dạng chuỗi xml theo cusCode.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "cusCode", type: "string", required: true, description: "Mã đơn vị cần lấy hóa đơn về" },
        { name: "fromDate", type: "string", required: false, description: "Ngày bắt đầu tìm kiếm (dd/MM/yyyy) hoặc null" },
        { name: "toDate", type: "string", required: false, description: "Ngày kết thúc tìm kiếm (dd/MM/yyyy) hoặc null" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK: chuỗi_xml_trả_về", message: "Thông tin các hóa đơn đã phát hành, đã sửa đổi, thay thế, sử dụng của công ty dưới dạng chuỗi xml" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Không tồn tại khách hàng tương ứng với cusCode" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: `<Data><Item><index>*</index><invToken>*</invToken><fkey>*</fkey><name>*</name><publishDate>*</publishDate><signStatus>*</signStatus><total>*</total><amount>*</amount><pattern>*</pattern><serial>*</serial><invNum>*</invNum><status>*</status><payment>*</payment></Item></Data>`
    },
    {
      id: "list-inv-by-cus-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.10",
      name: "listInvByCusFkey",
      description: "Trả về thông tin cơ bản của hóa đơn dạng chuỗi xml theo fkey truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Mã xác định hóa đơn" },
        { name: "fromDate", type: "string", required: false, description: "Ngày bắt đầu tìm kiếm (dd/MM/yyyy) hoặc null" },
        { name: "toDate", type: "string", required: false, description: "Ngày kết thúc tìm kiếm (dd/MM/yyyy) hoặc null" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK: chuỗi_xml_trả_về", message: "Thông tin các hóa đơn dưới dạng chuỗi xml" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: `<Data><Item><index>*</index><cusCode>*</cusCode><month>*</month><name>*</name><publishDate>*</publishDate><signStatus>*</signStatus><pattern>*</pattern><serial>*</serial><invNum>*</invNum><amount>*</amount><status>*</status><cusname>*</cusname><payment>*</payment><converted>*</converted></Item></Data>`
    },
    {
      id: "get-inv-view",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.11",
      name: "getInvView",
      description: "Trả về định dạng html của hóa đơn theo chuỗi token truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-inv-view-no-pay",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.12",
      name: "getInvViewNoPay",
      description: "Trả về định dạng html của hóa đơn theo chuỗi token truyền vào, không kiểm tra trạng thái thanh toán.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-inv-view-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.13",
      name: "getInvViewFkey",
      description: "Trả về định dạng html của hóa đơn theo fkey truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-new-inv-view-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.14",
      name: "getNewInvViewFkey",
      description: "Trả về định dạng html của hóa đơn mới tạo theo fkey truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_html_trả_về", message: "Trả về chuỗi html tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Fkey truyền vào rỗng" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-inv-view-fkey-no-pay",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.15",
      name: "getInvViewFkeyNoPay",
      description: "Trả về định dạng html của hóa đơn theo fkey truyền vào, không kiểm tra trạng thái thanh toán.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "convert-for-verify",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.16",
      name: "convertForVerify",
      description: "Thực hiện chuyển đổi với mục đích chứng minh nguồn gốc xuất xứ cho hóa đơn. (Chỉ 1 lần duy nhất).",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn đã chuyển đổi" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company tương ứng cho user" },
        { code: "ERR:8", message: "Hóa đơn đã được chuyển đổi" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "convert-for-verify-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.17",
      name: "convertForVerifyFkey",
      description: "Thực hiện chuyển đổi với mục đích chứng minh nguồn gốc xuất xứ cho hóa đơn. (Chỉ 1 lần duy nhất).",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn đã chuyển đổi" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company tương ứng cho user" },
        { code: "ERR:8", message: "Hóa đơn đã được chuyển đổi" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "convert-for-store",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.18",
      name: "convertForStore",
      description: "Thực hiện chuyển đổi với mục đích lưu trữ, mỗi hóa đơn sẽ được chuyển đổi nhiều lần.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi hml tương ứng với hóa đơn đã chuyển đổi" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không chính xác" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy công ty" },
        { code: "ERR:8", message: "Hóa đơn đã chuyển đổi" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-cus",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.19",
      name: "getCus",
      description: "Lấy thông tin khách hàng dựa vào mã khách hàng truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "cusCode", type: "string", required: true, description: "Mã khách hàng" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi xml thông tin khách hàng" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Không tìm thấy thông tin khách hàng" },
        { code: "ERR:7", message: "Không tìm thấy khách hàng hoặc công ty tương ứng" },
        { code: "ERR:", message: "Lỗi không xác định" }
      ],
      xmlTemplate: `<Data><code>*</code><name>*</name><address>*</address><phone>*</phone><taxcode>*</taxcode><email>*</email></Data>`
    },
    {
      id: "convert-for-store-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.20",
      name: "convertForStoreFkey",
      description: "Thực hiện chuyển đổi với mục đích lưu trữ PDF, mỗi hóa đơn sẽ được chuyển đổi nhiều lần.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_base64_trả_về", message: "Trả về chuỗi base64 tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không chính xác" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy công ty" },
        { code: "ERR:8", message: "Hóa đơn đã chuyển đổi" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-error-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.21",
      name: "downloadInvErrorFkey",
      description: "Tải về chuỗi xml của hóa đơn lỗi gửi cơ quan thuế theo fkey truyền lên.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-error-pdf",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.22",
      name: "downloadInvErrorPDF",
      description: "Tải về dạng pdf của hóa đơn lỗi gửi cơ quan thuế theo token truyền lên.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "token", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-inv-error-view-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.23",
      name: "GetInvErrorViewFkey",
      description: "Tải về dạng HTML của hóa đơn lỗi gửi cơ quan thuế theo fkey truyền lên.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .html để được file HTML" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Công ty chưa có mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-pdf-fkey-error",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.24",
      name: "downloadInvPDFFkeyError",
      description: "Tải về dạng pdf của hóa đơn lỗi gửi thuế định dạng Pdf theo Fkey.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-error",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.25",
      name: "downloadInvError",
      description: "Tải về chuỗi xml của hóa đơn lỗi gửi cơ quan thuế theo invtoken.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy Pattern" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-no-pay-error",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.26",
      name: "downloadInvNoPayError",
      description: "Tải về chuỗi xml của hóa đơn lỗi gửi cơ quan thuế với cả các hóa đơn chưa thanh toán theo invtoken.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy Pattern" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-pdf-fkey-no-pay-error",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.27",
      name: "downloadInvPDFFkeyNoPayError",
      description: "Tải về dạng pdf của hóa đơn lỗi gửi thuế định dạng Pdf, không kiểm tra trạng thái thanh toán theo fkey.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-pdf-no-pay-error",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.28",
      name: "downloadInvPDFNoPayError",
      description: "Tải về dạng pdf của hóa đơn lỗi gửi thuế định dạng Pdf, không kiểm tra trạng thái thanh toán theo Token.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "token", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với hóa đơn. Lưu chuỗi này thành file .pdf để được file PDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-inv-view-by-date",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.29",
      name: "GetInvViewByDate",
      description: "Lấy danh sách hóa đơn từ ngày đến ngày theo mẫu số, ký hiệu.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu" },
        { name: "fromDate", type: "string", required: true, description: "Từ ngày" },
        { name: "toDate", type: "string", required: true, description: "Đến ngày" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 của xml danh sách hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:3", message: "Sai định dạng ngày tháng" },
        { code: "ERR:4", message: "Không lấy được bảng hóa đơn (sai mẫu số)" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Vượt quá giới hạn số lượng hóa đơn được phép lấy (500 hóa đơn)" },
        { code: "ERR:7", message: "Vượt quá giới hạn 7 ngày" }
      ],
      xmlTemplate: `<DSHDon><HDon><DLieu>*</DLieu><Loai>*</Loai><TThai>*</TThai></HDon></DSHDon>`
    },
    {
      id: "download-inv-zip-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.30",
      name: "downloadInvZipFkey",
      description: "Tải về file .zip chứa 2 file .xml và .html của hóa đơn theo Fkey.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định hóa đơn" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "checkPayment", type: "bool", required: true, description: "true: Chỉ tải hóa đơn đã thanh toán; false: Tải không cần kiểm tra" }
      ],
      responseParams: [
        { code: "Chuỗi Base64", message: "Trả về chuỗi Base64. Lưu chuỗi Base64 này thành file .zip chứa 2 file .xml và .html của hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:4", message: "Không tìm thấy dải thông báo phát hành" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-zip-token",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.31",
      name: "downloadInvZipToken",
      description: "Tải về file .zip chứa 2 file .xml và .html của hóa đơn theo Token.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "checkPayment", type: "bool", required: true, description: "true: Chỉ tải hóa đơn đã thanh toán; false: Tải không cần kiểm tra" }
      ],
      responseParams: [
        { code: "Chuỗi Base64", message: "Trả về chuỗi Base64. Lưu chuỗi Base64 này thành file .zip chứa 2 file .xml và .html của hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền ServiceRole" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Không tìm thấy Pattern" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy thông tin công ty tương ứng cho user" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán nên không xem được" },
        { code: "ERR:12", message: "Hoá đơn có mã chưa được thuế chấp nhận" },
        { code: "ERR:13", message: "Hoá đơn không mã chưa được thuế chấp nhận" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-link-inv-view",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.32",
      name: "GetLinkInvView",
      description: "Trả về định dạng link view của hóa đơn theo chuỗi token truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64 trả_về", message: "Trả về base 64 XML chứa LinkView, LinkXML, LinkPDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:4", message: "Công ty chưa được đăng kí mẫu hóa đơn tương ứng pattern của chuỗi invtoken truyền vào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" }
      ],
      xmlTemplate: `<LinkInv><LinkView>*</LinkView><LinkXML>*</LinkXML><LinkPDF>*</LinkPDF></LinkInv>`
    },
    {
      id: "get-link-inv-view-fkey",
      serviceGroupId: "basic-portal",
      sectionNumber: "2.2.33",
      name: "GetLinkInvViewFkey",
      description: "Trả về định dạng link view của hóa đơn theo fkey truyền vào.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi key xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "Chuỗi base64 trả_về", message: "Trả về base 64 XML chứa LinkView, LinkXML, LinkPDF" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:4", message: "Công ty chưa được đăng ký mẫu hóa đơn nào" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" }
      ],
      xmlTemplate: `<LinkInv><LinkView>*</LinkView><LinkXML>*</LinkXML><LinkPDF>*</LinkPDF></LinkInv>`
    },

    // --- CHƯƠNG 2.3: BUSINESS SERVICE (XỬ LÝ NGHIỆP VỤ) ---
    {
      id: "confirm-payment-fkey",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.1",
      name: "confirmPaymentFkey",
      description: "Thực hiện gạch nợ hóa đơn theo danh sách fkey truyền vào.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstFkey", type: "string", required: true, description: "Chuỗi Fkey xác định hóa đơn cần lấy(các Fkey phân biệt nhau bằng “_”)" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Đánh dấu hóa đơn trong list đã được gạch nợ" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn tương ứng chuỗi đưa vào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định" },
        { code: "ERR:13", message: "Hóa đơn đã được gạch nợ trước đó" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "confirm-payment",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.2",
      name: "confirmPayment",
      description: "Thực hiện gạch nợ hóa đơn theo danh sách chuỗi invtoken truyền vào.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstInvToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn (theo cấu trúc patternt;serial;sốhóađơn)" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Đánh dấu hóa đơn trong list đã được gạch nợ" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn tương ứng chuỗi đưa vào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định" },
        { code: "ERR:13", message: "Hóa đơn đã được gạch nợ trước đó" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "unconfirm-payment-fkey",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.3",
      name: "UnconfirmPaymentFkey",
      description: "Thực hiện bỏ gạch nợ hóa đơn theo danh sách chuỗi fkey truyền vào.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstFkey", type: "string", required: true, description: "Chuỗi Fkey xác định hóa đơn cần lấy(các Fkey phân biệt nhau bằng “_”)" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Đánh dấu hóa đơn trong list đã được bỏ gạch nợ" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn tương ứng chuỗi đưa vào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định" },
        { code: "ERR:13", message: "Hóa đơn đã được bỏ gạch nợ trước đó" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "unconfirm-payment",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.4",
      name: "unConfirmPayment",
      description: "Thực hiện bỏ gạch nợ hóa đơn theo danh sách chuỗi invtoken truyền vào.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstInvToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn (theo cấu trúc patternt;serial;sốhóađơn)" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Đánh dấu hóa đơn trong list đã được bỏ gạch nợ" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không đúng định dạng" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn tương ứng chuỗi đưa vào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định" },
        { code: "ERR:13", message: "Hóa đơn đã được bỏ gạch nợ trước đó" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "adjust-invoice-action",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.5",
      name: "AdjustInvoiceAction",
      description: "Thực hiện điều chỉnh hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần điều chỉnh" },
        { name: "AttachFile", type: "string", required: true, description: "=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Đã phát hành hóa đơn điều chỉnh thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Hóa đơn cần điều chỉnh không tồn tại" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company" },
        { code: "ERR:8", message: "Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được điều chỉnh" },
        { code: "ERR:13", message: "Lỗi trùng fkey của hóa đơn mới" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern" },
        { code: "ERR:21", message: "Trùng Fkey truyền vào" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn mới nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết" }
      ],
      xmlTemplate: `<AdjustInv>
    <key>Giá trị khóa</key>
    <LDo>Lý do điều chỉnh</LDo>
    <NDTDCHinh>Nội dung trước điều chỉnh</NDTDCHinh>
    <NDSDCHinh>Nội dung sau điều chỉnh</NDSDCHinh>
    <CusCode>*</CusCode>
    ...
    <Type>2:Tăng, 3:Giảm, 4:Thông tin, 6:Kết hợp</Type>
</AdjustInv>`
    },
    {
      id: "adjust-action-assigned-no",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.6",
      name: "AdjustActionAssignedNo",
      description: "Thực hiện điều chỉnh hóa đơn cho phép truyền số hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần điều chỉnh" },
        { name: "AttachFile", type: "string", required: true, description: "=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Đã phát hành hóa đơn điều chỉnh thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Hóa đơn cần điều chỉnh không tồn tại" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company" },
        { code: "ERR:8", message: "Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được điều chỉnh" },
        { code: "ERR:13", message: "Lỗi trùng fkey của hóa đơn mới" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn mới nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết" }
      ],
      xmlTemplate: `<AdjustInv>
    <key>Giá trị khóa</key>
    <InvoiceNo>Số hóa đơn</InvoiceNo>
    <CusCode>*</CusCode>
    ...
</AdjustInv>`
    },
    {
      id: "adjust-invoice-no-publish",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.7",
      name: "AdjustInvoiceNoPublish",
      description: "Thực hiện lấy dữ liệu html hóa đơn mới của điều chỉnh hóa đơn trước khi ký số phát hành.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần điều chỉnh" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi html tương ứng với hóa đơn điều chỉnh nhưng chưa phát hành, ký số" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Hóa đơn cần điều chỉnh không tồn tại" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình tạo mới hóa đơn điều chỉnh" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company tương ứng cho user" },
        { code: "ERR:8", message: "Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được điều chỉnh" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp" }
      ],
      xmlTemplate: `<AdjustInv><key>*</key><CusCode>*</CusCode>...</AdjustInv>`
    },
    {
      id: "cancel-inv",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.8",
      name: "cancelInv",
      description: "Thực hiện hủy hóa đơn theo giá trị fkey truyền vào.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "Fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần hủy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK:", message: "Hủy hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:6", message: "Lỗi không xác định" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định" },
        { code: "ERR:8", message: "Hóa đơn đã bị điều chỉnh / hủy / hóa đơn mới tạo không thể hủy được" },
        { code: "ERR:9", message: "Hóa đơn đã thanh toán, không cho phép hủy" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "replace-invoice-action",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.9",
      name: "ReplaceInvoiceAction",
      description: "Thực hiện thay thế hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "AttachFile", type: "string", required: true, description: "=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Đã phát hành hóa đơn thay thế thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình thay thế hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company" },
        { code: "ERR:8", message: "Hóa đơn đã được thay thế rồi. Không thể thay thế nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được thay thế" },
        { code: "ERR:13", message: "Lỗi trùng fkey của hóa đơn mới" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern" },
        { code: "ERR:21", message: "Trùng Fkey truyền vào" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết" }
      ],
      xmlTemplate: `<ReplaceInv>
    <key>*</key>
    <LDo>Lý do Thay thế</LDo>
    <CusCode>*</CusCode>
    ...
</ReplaceInv>`
    },
    {
      id: "replace-action-assigned-no",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.10",
      name: "ReplaceActionAssignedNo",
      description: "Thực hiện thay thế hóa đơn cho phép truyền số hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "Attachfile", type: "string", required: true, description: "=10: sinh biên bản tự động, =11: sinh và ký biên bản tự động, != 10 và !=11: Đường dẫn file biên bản" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Đã phát hành hóa đơn thay thế thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình thay thế hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company tương ứng cho user" },
        { code: "ERR:8", message: "Hóa đơn đã được thay thế rồi. Không thể thay thế nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được thay thế" },
        { code: "ERR:13", message: "Lỗi trùng fkey của hóa đơn mới" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết" }
      ],
      xmlTemplate: `<ReplaceInv>
    <key>fkey hóa đơn*</key>
    <LDo>Lý do thay thế</LDo> 
    <InvoiceNo>Số hóa đơn</InvoiceNo>
    ...
</ReplaceInv>`
    },
    {
      id: "replace-invoice-no-publish",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.11",
      name: "ReplaceInvoiceNoPublish",
      description: "Thực hiện lấy dữ liệu html hóa đơn mới của thay thế hóa đơn trước khi ký số phát hành.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về chuỗi html tương ứng với hóa đơn thay thế nhưng chưa phát hành, ký số" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình tạo mới hóa đơn thay thế" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company tương ứng cho user" },
        { code: "ERR:8", message: "Hóa đơn đã được thay thế rồi. Không thể thay thế nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được thay thế" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế, điều chỉnh các hóa đơn không mã gửi thông tin chi tiết" }
      ],
      xmlTemplate: `<ReplaceInv><key>fkey hóa đơn*</key><CusCode>Mã khách hàng*</CusCode>...</ReplaceInv>`
    },
    {
      id: "cancel-inv-no-pay",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.12",
      name: "cancelInvNoPay",
      description: "Thực hiện hủy hóa đơn theo giá trị fkey truyền vào không check trạng thái thanh toán.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "Fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần hủy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK:", message: "Hủy hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:6", message: "Lỗi không xác định" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty tương ứng, hoặc lỗi không xác định" },
        { code: "ERR:8", message: "Hóa đơn đã bị điều chỉnh / hủy / hóa đơn mới tạo không thể hủy được" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "deliver-inv",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.13",
      name: "deliverInv",
      description: "Thực hiện tạo bản ghi deliver cho việc phân phối hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstInvToken", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy(theo cấu trúc patternt;serial;sốhóađơn)" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Hóa đơn gạch nợ thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Chuỗi token không hợp lệ" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn tương ứng chuỗi đưa vào" },
        { code: "ERR:11", message: "Chuỗi token đúng định dạng nhưng không tồn tại, hoặc là của hóa đơn đã bị hủy, bị thay thế" },
        { code: "ERR:", message: "Có lỗi không xác định" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "import-attachment-by-no",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.14",
      name: "ImportAttachmentByNo",
      description: "Thực hiện đính kèm file bảng kê cho hóa đơn theo số hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu" },
        { name: "no", type: "int", required: true, description: "Số hóa đơn" },
        { name: "bytes", type: "byte[]", required: true, description: "file dạng byte" }
      ],
      responseParams: [
        { code: "OK:MD5_file", message: "Trả về OK: Chỗi MD5 của file" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Sai định dạng file" },
        { code: "ERR:3", message: "File vượt quá 10MB" },
        { code: "ERR:4", message: "Không tìm thấy hóa đơn" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Lỗi tạo folder" },
        { code: "ERR:7", message: "Không tìm thấy công ty" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-file",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.15",
      name: "GetFile",
      description: "Thực hiện tải file bảng kê của hóa đơn theo fkey.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Fkey của hóa đơn" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" }
      ],
      responseParams: [
        { code: "Chuỗi base64", message: "Trả về chuỗi base64 tương ứng với file" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra khi thực hiện tải file" },
        { code: "ERR:6", message: "Không tìm thấy hóa đơn với Fkey truyền vào" },
        { code: "ERR:7", message: "Không tìm thấy công ty" },
        { code: "ERR:8", message: "Hóa đơn không có file đính kèm" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "adjust-invoice-multi",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.16",
      name: "AdjustInvoiceMulti",
      description: "Thực hiện điều chỉnh nhiều hóa đơn cùng lúc.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkeys", type: "string", required: true, description: "Danh sách chuỗi fkey xác định các hóa đơn cần điều chỉnh" },
        { name: "AttachFile", type: "string", required: true, description: "File đính kèm" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Hóa đơn cần điều chỉnh không tồn tại" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company tương ứng cho user" },
        { code: "ERR:8", message: "Hóa đơn cần điều chỉnh đã bị thay thế. Không thể điều chỉnh được nữa" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được điều chỉnh" },
        { code: "ERR:13", message: "Lỗi trùng fkey của hóa đơn mới" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và serial không phù hợp" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "restore-cancel-inv-fkey",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.17",
      name: "restoreCancelInvFkey",
      description: "Thực hiện khôi phục hóa đơn đã hủy về trạng thái đang sử dụng bằng Fkey.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản truy cập CAdmin" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu truy cập CAdmin" },
        { name: "fkey", type: "string", required: true, description: "Fkey của hóa đơn cần khôi phục" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Khôi phục hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền" },
        { code: "ERR:6", message: "Lỗi Exception" },
        { code: "ERR:7", message: "Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo" },
        { code: "ERR:8", message: "Hóa đơn đang không ở trạng thái đã hủy" },
        { code: "ERR:20", message: "Không tìm thấy thông tin PublishInvoice" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "restore-cancel-inv-token",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.18",
      name: "restoreCancelInvFkey",
      description: "Thực hiện khôi phục hóa đơn đã hủy về trạng thái đang sử dụng bằng Token.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản truy cập CAdmin" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu truy cập CAdmin" },
        { name: "token", type: "string", required: true, description: "Chuỗi token xác định hóa đơn cần lấy" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Khôi phục hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền" },
        { code: "ERR:6", message: "Lỗi Exception" },
        { code: "ERR:7", message: "Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo" },
        { code: "ERR:8", message: "Hóa đơn đang không ở trạng thái đã hủy" },
        { code: "ERR:10", message: "Vượt quá giới hạn số thông tin hóa đơn truyền lên bằng token" },
        { code: "ERR:20", message: "Không tìm thấy thông tin PublishInvoice" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "restore-replaced-inv-fkey",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.19",
      name: "restoreReplacedInvFkey",
      description: "Thực hiện khôi phục hóa đơn bị thay thế bằng Fkey từ hóa đơn được thay về hóa đơn bị thay thế.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản truy cập CAdmin" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu truy cập CAdmin" },
        { name: "fkeyReplaced", type: "string", required: true, description: "FKey hóa đơn đang sử dụng (được thay thế, cần khôi phục về hóa đơn trước đó)" },
        { name: "fkeyReplacedOld", type: "string", required: true, description: "FKey hóa đơn đã bị thay thế cần khôi phục lại về trạng thái sử dụng" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Khôi phục hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền" },
        { code: "ERR:6", message: "Lỗi Exception" },
        { code: "ERR:7", message: "Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo" },
        { code: "ERR:8", message: "Hóa đơn thay thế đang không ở trạng thái có chứ ký của nhà phát hành" },
        { code: "ERR:9", message: "Thông tin hóa đơn gốc và hóa đơn bị thay thế không chính xác" },
        { code: "ERR:20", message: "Không tìm thấy thông tin PublishInvoice" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "restore-replaced-inv-token",
      serviceGroupId: "basic-business",
      sectionNumber: "2.3.20",
      name: "restoreReplacedInvFkey",
      description: "Thực hiện khôi phục hóa đơn bị thay thế bằng Token từ hóa đơn được thay về hóa đơn bị thay thế.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản truy cập CAdmin" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu truy cập CAdmin" },
        { name: "tokenReplaced", type: "string", required: true, description: "Chuỗi token của hóa đơn đang sử dụng (được thay thế, cần khôi phục về hóa đơn trước đó)" },
        { name: "tokenReplacedOld", type: "string", required: true, description: "Chuỗi token của hóa đơn đã bị thay thế cần khôi phục lại về trạng thái sử dụng" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK", message: "Khôi phục hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn hoặc có nhiều hơn 1 hóa đơn với tham số đã truyền" },
        { code: "ERR:6", message: "Lỗi Exception" },
        { code: "ERR:7", message: "Tài khoản không phù hợp hoặc không tìm thấy company ứng với tài khoản đã khai báo" },
        { code: "ERR:8", message: "Hóa đơn thay thế đang không ở trạng thái có chứ ký của nhà phát hành" },
        { code: "ERR:9", message: "Thông tin hóa đơn gốc và hóa đơn bị thay thế không chính xác" },
        { code: "ERR:10", message: "Vượt quá giới hạn số thông tin hóa đơn truyền lên bằng token" },
        { code: "ERR:20", message: "Không tìm thấy thông tin PublishInvoice" }
      ],
      xmlTemplate: "N/A"
    },

    // --- CHƯƠNG 3: NGHIỆP VỤ THÔNG TƯ 78 (TT78) ---
    // 3.1. Nhóm các hàm webservice tạo lập và phát hành hóa đơn (PublishService)
    {
      id: "tt78-import-and-publish-inv",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.1",
      name: "ImportAndPublishInv",
      description: "Cho phép phát hành hóa đơn với dữ liệu XML của khách hàng, tối đa cho 5000 hóa đơn.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thêm khách hàng" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn (Lỗi không xác định)" },
        { code: "ERR:6", message: "Dải hóa đơn không đủ số hóa đơn cho lô phát hành" },
        { code: "ERR:7", message: "Thông tin về Username/pass không hợp lệ" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng cho phép" },
        { code: "ERR:13", message: "Lỗi trùng fkey" },
        { code: "ERR:20", message: "Pattern và Serial không phù hợp" },
        { code: "ERR:21", message: "Lỗi trùng số hóa đơn" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" }
      ],
      xmlTemplate: `<DSHDon><HDon><key>Fkey cua hoa don</key><DLHDon>...</DLHDon></HDon></DSHDon>`
    },
    {
      id: "tt78-import-and-publish-assigned-no",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.2",
      name: "ImportAndPublishAssignedNo",
      description: "Cho phép phát hành hóa đơn với dữ liệu XML truyền số hóa đơn, tối đa cho 5000 hóa đơn.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn không đủ số hóa đơn cho lô phát hành" },
        { code: "ERR:7", message: "Thông tin về Username/pass không hợp lệ" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng cho phép" },
        { code: "ERR:13", message: "Lỗi trùng fkey" },
        { code: "ERR:20", message: "Pattern và Serial không phù hợp" },
        { code: "ERR:21", message: "Lỗi trùng số hóa đơn" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Danh sách hóa đơn tồn tại ngày hóa đơn nhỏ hơn ngày phát hành" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" }
      ],
      xmlTemplate: `<DSHDon><HDon><key>Fkey cua hoa don</key><DLHDon><InvoiceNo>Số hóa đơn truyền vào *</InvoiceNo>...</DLHDon></HDon></DSHDon>`
    },
    {
      id: "tt78-import-inv",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.3",
      name: "ImportInv",
      description: "Thêm mới hóa đơn từ chuỗi xml đầu vào theo chuẩn mô tả.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi xml chứa thông tin hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-invKeyList", message: "Tạo hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai" },
        { code: "ERR:3", message: "Định dạng xml của hóa đơn sai cấu trúc" },
        { code: "ERR:5", message: "Không tìm thấy công ty / Lỗi hệ thống" },
        { code: "ERR:6", message: "Không còn dư số hóa đơn để phát hành" },
        { code: "ERR:10", message: "Vượt quá số lượng hóa đơn tạo cho phép (tối đa 5000)" },
        { code: "ERR:20", message: "Pattern và serial không hợp lệ" }
      ],
      xmlTemplate: `<DSHDon><HDon><key>Fkey cua hoa don</key><DLHDon>...</DLHDon></HDon></DSHDon>`
    },
    {
      id: "tt78-import-inv-by-pattern",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.4",
      name: "ImportInvByPattern",
      description: "Thêm mới hóa đơn theo mẫu số, ký hiệu.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Không đủ số lượng hóa đơn cho lô thêm mới" },
        { code: "ERR:7", message: "User name không phù hợp hoặc Pattern/serial không phù hợp" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá max cho phép" },
        { code: "ERR:13", message: "Danh sách hóa đơn tồn tại hóa đơn trùng Fkey" },
        { code: "ERR:22", message: "Trùng số hóa đơn" }
      ],
      xmlTemplate: `<DSHDon><HDon><key>Fkey cua hoa don</key><DLHDon>...</DLHDon></HDon></DSHDon>`
    },
    {
      id: "tt78-get-inv-data-by-fkey",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.5",
      name: "GetInvDataByFkey",
      description: "Lấy nội dung XMLData Hóa đơn có mã CQT trả về.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "fkey của hóa đơn" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "accPass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" }
      ],
      responseParams: [
        { code: "DataBase64", message: "Dữ liệu xml hóa đơn có mã CQT dạng Base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu" },
        { code: "ERR:7", message: "User name không phù hợp, không tìm thấy company" },
        { code: "ERR:21", message: "Không lấy được mẫu mặc định của công ty" },
        { code: "ERR:22", message: "Không lấy được invoice service theo mẫu số truyền vào" },
        { code: "ERR:23", message: "Fkey truyền vào không đúng" },
        { code: "ERR:24", message: "Không lấy được InvoiceData, hóa đơn có thể chưa được cấp mã" },
        { code: "ERR:25", message: "Trường InvoiceData chưa được lưu ở hóa đơn" },
        { code: "ERR:78", message: "Khách hàng không sử dụng hóa đơn cấp mã từ cơ quan thuế hoặc không cấu hình sử dụng theo TT78" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-get-mccqthue-by-invtokens",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.6",
      name: "GetMCCQThueByInvTokens",
      description: "Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách invToken.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "invTokens", type: "string", required: true, description: "danh sách chuỗi token xác định hóa đơn cần lấy" }
      ],
      responseParams: [
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng" },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" }
      ],
      xmlTemplate: `<DSHDon><HDon><KHMSHDon>Mẫu số</KHMSHDon><KHHDon>Ký hiệu</KHHDon><SHDon>Số</SHDon><MCCQThue>Mã CQT</MCCQThue><TThai>Trạng thái</TThai><MTLoi>Lỗi</MTLoi><Fkey>Fkey</Fkey></HDon></DSHDon>`
    },
    {
      id: "tt78-get-mccqthue-by-fkeys",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.7",
      name: "GetMCCQThueByFkeys",
      description: "Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách Fkey.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số hóa đơn" },
        { name: "fkeys", type: "string", required: true, description: "danh sách chuỗi fkey xác định hóa đơn cần lấy" }
      ],
      responseParams: [
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng" },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" }
      ],
      xmlTemplate: `<DSHDon><HDon><KHMSHDon>Mẫu số</KHMSHDon><KHHDon>Ký hiệu</KHHDon><SHDon>Số</SHDon><MCCQThue>Mã CQT</MCCQThue><TThai>Trạng thái</TThai><MTLoi>Lỗi</MTLoi><Fkey>Fkey</Fkey></HDon></DSHDon>`
    },
    {
      id: "tt78-get-mccqthue-by-invtokens-no-xml-sign",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.8",
      name: "GetMCCQThueByInvTokensNoXMLSign",
      description: "Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách invToken.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "invTokens", type: "string", required: true, description: "danh sách chuỗi token" }
      ],
      responseParams: [
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng" },
        { code: "ERR:5", message: "Lỗi không xác định" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" }
      ],
      xmlTemplate: `<DSHDon><HDon><KHMSHDon>Mẫu số</KHMSHDon><KHHDon>Ký hiệu</KHHDon><SHDon>Số</SHDon><MCCQThue>Mã CQT</MCCQThue><TThai>Trạng thái</TThai><MTLoi>Lỗi</MTLoi><Fkey>Fkey</Fkey></HDon></DSHDon>`
    },
    {
      id: "tt78-get-mccqthue-by-fkeys-no-xml-sign",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.9",
      name: "GetMCCQThueByFkeysNoXMLSign",
      description: "Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách Fkey.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số hóa đơn" },
        { name: "fkeys", type: "string", required: true, description: "danh sách chuỗi fkey" }
      ],
      responseParams: [
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng" },
        { code: "ERR:5", message: "Lỗi không xác định" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" }
      ],
      xmlTemplate: `<DSHDon><HDon><KHMSHDon>Mẫu số</KHMSHDon><KHHDon>Ký hiệu</KHHDon><SHDon>Số</SHDon><MCCQThue>Mã CQT</MCCQThue><TThai>Trạng thái</TThai><MTLoi>Lỗi</MTLoi><Fkey>Fkey</Fkey></HDon></DSHDon>`
    },
    {
      id: "tt78-send-inv-notice-errors",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.10",
      name: "SendInvNoticeErrors",
      description: "Gửi thông điệp hóa đơn điện tử có sai sót.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp hóa đơn điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert từ TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra (Lỗi không xác định)" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng tối đa cho phép" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" }
      ],
      xmlTemplate: `<DLTBao><TNNT></TNNT><TCQT></TCQT><NTBao></NTBao><DDanh></DDanh><Loai></Loai>...<DSHDon><HDon>...</HDon></DSHDon></DLTBao>`
    },
    {
      id: "tt78-get-hash-inv-notice-errors",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.11",
      name: "GetHashInvNoticeErrors",
      description: "Gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng token, lấy hash value để ký số bằng token ở client.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gửi thông điệp" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "Chuỗi xml thông điệp hóa đơn điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "base64Hash", message: "Chuỗi trả về sử dụng để ký số token" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng tối đa cho phép" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<DLTBao><TNNT></TNNT><TCQT></TCQT><NTBao></NTBao><DDanh></DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSHDon><HDon>...</HDon></DSHDon></DLTBao>`
    },
    {
      id: "tt78-send-inv-notice-errors-with-token",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.12",
      name: "SendInvNoticeErrorsWidthToken",
      description: "Gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá max cho phép" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" }
      ],
      xmlTemplate: `<CKS><SerialCert>*</SerialCert><Base64Hash>*</Base64Hash><SignValue>*</SignValue></CKS>`
    },
    {
      id: "tt78-get-hash-inv-notice-errors-with-smartca",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.13",
      name: "GetHashInvNoticeErrorsWithSmartCA",
      description: "Gửi thông điệp hóa đơn điện tử có sai sót với hệ thống sử dụng smartCA, lấy hash value để ký số bằng smartCA.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp hóa đơn điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serial", type: "string", required: true, description: "serial của chứng thư SmartCA công ty đã đăng ký" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "hash", message: "Chuỗi hash sử dụng để ký số smartCA" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng tối đa cho phép" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<DLTBao><TNNT></TNNT><TCQT></TCQT><NTBao></NTBao><DDanh></DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSHDon><HDon>...</HDon></DSHDon></DLTBao>`
    },
    {
      id: "tt78-send-inv-notice-errors-with-smartca",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.14",
      name: "SendInvNoticeErrorsWithSmartCA",
      description: "Gửi thông điệp hóa đơn điện tử có sai sót với các hệ thống sử dụng SmartCA, sau khi lấy giá trị Hash.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá max cho phép" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" }
      ],
      xmlTemplate: `<CKS><SerialCert>*</SerialCert><HashValue>*</HashValue><SignValue>*</SignValue></CKS>`
    },
    {
      id: "tt78-received-invoice-errors",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.15",
      name: "ReceivedInvoiceErrors",
      description: "Nhận kết quả phản hồi của thuế theo mã thông điệp.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "mtd", type: "string", required: true, description: "Mã thông điệp thuế trả về" }
      ],
      responseParams: [
        { code: "OK:mtd:dshoadon", message: "Nhận kết quả thành công, trả về mã thông điêp và danh sách hóa đơn bị lỗi" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Mã thông điệp không họp lệ, không tìm thấy bản ghi transaction" },
        { code: "ERR:4", message: "Chưa có kêt quả thuế trả về, trạng thái chi tiết chưa được cập nhật" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:7", message: "Không tìm thấy chi tiết hóa đơn sai sót" },
        { code: "ERR:8", message: "Lỗi nhận kết quả từ cơ quan thuế" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-handle-invoice-errors",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.16",
      name: "HandleInvoiceErrors",
      description: "Xử lý cập nhật trạng thái hủy hóa đơn mới và khôi phục trạng thái hóa đơn gốc trường hợp bị thuế từ chối.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "mtd", type: "string", required: true, description: "Mã thông điệp thuế trả về" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Trường hợp ký số HSM: cập nhật trạng thái thành công, kết quả trả về mã thông điệp" },
        { code: "OK:xml", message: "Trường hợp ký số token: cập nhật trạng thái thành công, trả về Xml để gọi webservice gửi thông điệp bằng token" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Mã thông điệp không họp lệ, không tìm thấy bản ghi transaction" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:4", message: "Chưa có kêt quả thuế trả về, trạng thái chi tiết chưa được cập nhật" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Có lỗi xảy ra trong quá trình update trạng thái hóa đơn sai sót" },
        { code: "ERR:7", message: "Không tìm thấy chi tiết hóa đơn sai sót" },
        { code: "ERR:8", message: "Không tìm thấy danh sách hóa đơn hủy để gửi mẫu 04, không có hóa đơn thuế từ chối" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:51", message: "Verify chứng thư lỗi" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-get-transaction-items",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.17",
      name: "GetTransactionItems",
      description: "Lấy danh sách lịch sử truyền nhận lên CQT theo tham số tìm kiếm và phân trang.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "status", type: "int", required: true, description: "Trạng thái (-1: tất cả)" },
        { name: "mtdiep", type: "string", required: true, description: "Mã thông điệp" },
        { name: "message", type: "string", required: true, description: "Nội dung thông điệp truyền về" },
        { name: "fromDate", type: "string", required: true, description: "Ngày bắt đầu (dd/MM/yyyy)" },
        { name: "toDate", type: "string", required: true, description: "Ngày kết thúc (dd/MM/yyyy)" },
        { name: "mltdiep", type: "string", required: true, description: "Mã loại thông điệp" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu hóa đơn" },
        { name: "invNo", type: "decimal", required: true, description: "Số hóa đơn (0: lấy tất cả)" },
        { name: "step", type: "int", required: true, description: "Step của lịch sử truyền nhận (-2: lấy tất cả)" },
        { name: "pageIndex", type: "int", required: true, description: "Lấy trang hiện tại" },
        { name: "pageSize", type: "int", required: true, description: "Số bản ghi trong 1 trang" }
      ],
      responseParams: [
        { code: "OK:base64", message: "Danh sách lịch sử truyền nhận theo base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:7", message: "Không tìm thấy công ty đăng nhập" },
        { code: "ERR:12", message: "Định dạng ngày tháng không đúng" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-get-transaction-detail",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.18",
      name: "GetTransactionDetail",
      description: "Xem chi tiết bản ghi lịch sử truyền nhận.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "mtd", type: "string", required: true, description: "Mã thông điệp" }
      ],
      responseParams: [
        { code: "OK:base64", message: "Chi tiết bản ghi trả về dưới dạng Base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy công ty đăng nhập" },
        { code: "ERR:3", message: "Mã thông điệp không thuộc công ty tra cứu" },
        { code: "ERR:5", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-get-step-detail",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.19",
      name: "GetStepDetail",
      description: "Xem chi tiết step CQT trả kết quả về.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "stepId", type: "string", required: true, description: "Id step được trả kết quả" },
        { name: "mtd", type: "string", required: true, description: "Mã thông điệp" }
      ],
      responseParams: [
        { code: "OK:base64", message: "Chi tiết bản ghi trả về dưới dạng Base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy công ty đăng nhập" },
        { code: "ERR:3", message: "Mã thông điệp không thuộc công ty tra cứu" },
        { code: "ERR:4", message: "Tham số truyền vào rỗng" },
        { code: "ERR:5", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-get-results-transaction",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.20",
      name: "GetResultsTransaction",
      description: "Nhận kết quả lịch sự truyền nhận.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "Id", type: "int", required: true, description: "Id của Packagetranscation trong chi tiết step" },
        { name: "tranErr", type: "bool", required: true, description: "true: nhận lại lỗi màn chi tiết, false: màn danh sách" }
      ],
      responseParams: [
        { code: "Ok:kết quả", message: "Thông báo kết quả nhận kết quả" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy công ty đăng nhập" },
        { code: "ERR:3", message: "Mã thông điệp không thuộc công ty tra cứu" },
        { code: "ERR:4", message: "Tham số truyền vào rỗng" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Sai trạng thái" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-register-publish",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.21",
      name: "RegisterPublish",
      description: "Đăng ký tờ khai 01 (Mẫu 01/ĐKTĐ-HĐĐT).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML tờ khai 01 đã ký số" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "=0" }
      ],
      responseParams: [
        { code: "OK: mtd", message: "Đã gửi tờ khai 01 lên TCT: mã thông điệp" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Lỗi gửi dữ liệu đăng ký lên TCTN" },
        { code: "ERR:7 message", message: "Validate tờ khai và validate dữ liệu xml báo lỗi ở message" },
        { code: "ERR:8", message: "Mã số thuế trên xml không đúng mã số thuế của đơn vị" },
        { code: "ERR:9", message: "Không tìm thấy thông tin công ty" },
        { code: "ERR:11", message: "Verify dữ liệu ký số lỗi" },
        { code: "ERR:28", message: "Không tìm thấy thông tin chứng thư HSM" },
        { code: "ERR:51", message: "Chứng thư số bị thu hồi" }
      ],
      xmlTemplate: `<TKhai><DLTKhai Id="DuLieuKy"><TTChung><MSo>01/ĐKTĐ-HĐĐT</MSo><HThuc>2</HThuc>...</TTChung><NDTKhai>...</NDTKhai></DLTKhai></TKhai>`
    },
    {
      id: "tt78-received-register-publish",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.22",
      name: "ReceivedRegisterPublish",
      description: "Lấy kết quả tờ khai DK01.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "mtd", type: "string", required: true, description: "Mã thông điệp tờ khai 01" }
      ],
      responseParams: [
        { code: "OK: xml", message: "XML kết quả TCT trả về" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không tìm thấy thông điệp" },
        { code: "ERR:7", message: "Lỗi dữ liệu trả về từ TCTN" },
        { code: "ERR:11", message: "Dữ liệu xml validate lỗi" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-register-publish-invoice",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.23",
      name: "RegisterPublishInvoice",
      description: "Đăng ký dải số hóa đơn.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "Pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "Serial", type: "string", required: true, description: "Kí hiệu" },
        { name: "Quantity", type: "int", required: true, description: "Số lượng" },
        { name: "Type", type: "string", required: true, description: "=0" }
      ],
      responseParams: [
        { code: "OK", message: "Thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-cancel-publish-invoice",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.24",
      name: "CancelPublishInvoice",
      description: "Huỷ dải số hóa đơn.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "Pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "Serial", type: "string", required: true, description: "Kí hiệu" }
      ],
      responseParams: [
        { code: "OK", message: "Thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-get-hash-inv-smartca",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.25",
      name: "GetHashInvSmartCA",
      description: "Phát hành hóa đơn với các hệ thống sử dụng smartCA, lấy giá trị hash value để ký số bằng smartCA ở client.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số công ty" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4" },
        { name: "invToken", type: "string", required: true, description: "chuỗi token hóa đơn - chỉ cần khi thay thế/ điều chỉnh; phát hành thì để trống" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi xml chứa hashValue" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không còn đủ số lượng hóa đơn để phát hành" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá số lượng tối đa cho phép" },
        { code: "ERR:20", message: "Dải hóa đơn hết, User/Account không có quyền với Serial/Pattern và Serial không phù hợp" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" },
        { code: "ERR:35", message: "Công ty đăng ký DK01 cả có mã, không mã. Bắt buộc truyền pattern, serial" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "tt78-publish-inv-smartca",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.26",
      name: "PublishInvSmartCA",
      description: "Phát hành hóa đơn với các hệ thống sử dụng SmartCA, sau khi thực hiện gọi hàm Lấy giá trị Hash.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash hóa" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không còn đủ số lượng hóa đơn để phát hành" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá max cho phép" },
        { code: "ERR:20", message: "Không tìm thấy dải hóa đơn" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng với chứng thư đăng ký trong hệ thống" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "tt78-print-notice-inv-error",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.27",
      name: "PrintNoticeInvError",
      description: "In thông báo hóa đơn sai sót.",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "mtdiep", type: "string", required: true, description: "Mã thông điệp" }
      ],
      responseParams: [
        { code: "OK:string", message: "In thông báo hóa đơn sai sót trả về dưới dạng string" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Mã thông điệp không tồn tại" },
        { code: "ERR:3", message: "Data PackageTransactionData rỗng" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:7", message: "Dữ liệu in thông báo rỗng" },
        { code: "ERR:21", message: "Không tìm thấy công ty đăng nhập" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-remove-publish-invoice",
      serviceGroupId: "tt78-publish",
      sectionNumber: "3.1.28",
      name: "RemovePublishInvoice",
      description: "Xóa thông báo phát hành.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "Pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "Serial", type: "string", required: true, description: "Kí hiệu" }
      ],
      responseParams: [
        { code: "OK", message: "Thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:5", message: "Có lỗi xảy ra" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-adjust-action-assigned-no",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.1",
      name: "AdjustActionAssignedNo",
      description: "Thực hiện điều chỉnh hóa đơn cho phép truyền số hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần điều chỉnh" },
        { name: "AttachFile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Hóa đơn cần điều chỉnh không tồn tại" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:8", message: "Hóa đơn cần điều chỉnh đã bị thay thế" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được điều chỉnh" },
        { code: "ERR:13", message: "Lỗi trùng fkey" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize chuỗi hóa đơn đầu vào" },
        { code: "ERR:19", message: "Pattern truyền vào không giống với hóa đơn cần điều chỉnh" },
        { code: "ERR:20", message: "Dải hóa đơn hết, tài khoản không có quyền hoặc serial không phù hợp" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" }
      ],
      xmlTemplate: `<DieuChinhHD><key>*</key><LDo></LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh><Type></Type><InvoiceNo>*</InvoiceNo><TTChung><DVTTe>*</DVTTe><HTTToan>*</HTTToan></TTChung><NDHDon><NMua><Ten>*</Ten><DChi>*</DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><THHDVu>*</THHDVu></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></DieuChinhHD>`
    },
    {
      id: "tt78-adjust-invoice-no-publish",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.2",
      name: "AdjustInvoiceNoPublish",
      description: "Thực hiện lấy dữ liệu html hóa đơn mới của điều chỉnh hóa đơn trước khi ký số phát hành.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần điều chỉnh" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về một hóa đơn dưới dạng html" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Hóa đơn cần điều chỉnh không tồn tại" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình tạo mới hóa đơn điều chỉnh" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:8", message: "Hóa đơn cần điều chỉnh đã bị thay thế" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được điều chỉnh" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize" },
        { code: "ERR:19", message: "Pattern truyền vào không giống" },
        { code: "ERR:20", message: "Dải hóa đơn hết hoặc không phù hợp" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế" }
      ],
      xmlTemplate: `<DieuChinhHD><key>*</key><Type></Type><TTChung><DVTTe>*</DVTTe><HTTToan>*</HTTToan></TTChung><NDHDon><NMua><Ten>*</Ten><MST>*</MST><DChi>*</DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><THHDVu>*</THHDVu></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></DieuChinhHD>`
    },
    {
      id: "tt78-replace-action-assigned-no",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.3",
      name: "ReplaceActionAssignedNo",
      description: "Thực hiện thay thế hóa đơn cho phép truyền số hóa đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "Attachfile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thay thế" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình thay thế hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:8", message: "Hóa đơn đã được thay thế rồi" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được thay thế" },
        { code: "ERR:13", message: "Lỗi trùng fkey" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize" },
        { code: "ERR:19", message: "Pattern truyền vào không giống" },
        { code: "ERR:20", message: "Dải hóa đơn hết hoặc không phù hợp" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" }
      ],
      xmlTemplate: `<ThayTheHD><key>*</key><LDo></LDo><InvoiceNo></InvoiceNo><TTChung><DVTTe>*</DVTTe><HTTToan>*</HTTToan></TTChung><NDHDon><NMua><Ten>*</Ten><DChi>*</DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><THHDVu>*</THHDVu></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></ThayTheHD>`
    },
    {
      id: "tt78-replace-invoice-no-publish",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.4",
      name: "ReplaceInvoiceNoPublish",
      description: "Thực hiện lấy dữ liệu html hóa đơn mới của thay thế hóa đơn trước khi ký số phát hành.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "chuỗi_hml_trả_về", message: "Trả về một hóa đơn dưới dạng html" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình tạo mới hóa đơn thay thế" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:8", message: "Hóa đơn đã được thay thế rồi" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được thay thế" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize" },
        { code: "ERR:19", message: "Pattern truyền vào không giống" },
        { code: "ERR:20", message: "Dải hóa đơn hết hoặc không phù hợp" }
      ],
      xmlTemplate: `<ThayTheHD><key>*</key><TTChung><DVTTe>*</DVTTe></TTChung><NDHDon><NMua><Ten>*</Ten><DChi>*</DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><THHDVu>*</THHDVu></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></ThayTheHD>`
    },
    {
      id: "tt78-replace-assigned-no-new-pattern",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.5",
      name: "ReplaceAssignedNoNewPattern",
      description: "Thực hiện thay thế hóa đơn giữ số khác mẫu số.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "Attachfile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số mới" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" },
        { name: "OldPattern", type: "string", required: false, description: "Mẫu số cũ" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thay thế" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi trong quá trình thay thế hóa đơn" },
        { code: "ERR:6", message: "Dải hóa đơn cũ đã hết" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:8", message: "Hóa đơn đã được thay thế rồi" },
        { code: "ERR:9", message: "Trạng thái hóa đơn không được thay thế" },
        { code: "ERR:13", message: "Lỗi trùng fkey" },
        { code: "ERR:14", message: "Lỗi trong quá trình thực hiện cấp số hóa đơn" },
        { code: "ERR:15", message: "Lỗi khi thực hiện Deserialize" },
        { code: "ERR:19", message: "Pattern truyền vào không giống" },
        { code: "ERR:20", message: "Dải hóa đơn hết hoặc không phù hợp" },
        { code: "ERR:29", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:30", message: "Ngày hóa đơn nhỏ hơn ngày hóa đơn đã phát hành" },
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (Có mã / Không mã)" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp thay thế" }
      ],
      xmlTemplate: `<ThayTheHD><key>*</key><LDo></LDo><InvoiceNo>*</InvoiceNo><TTChung><DVTTe>*</DVTTe><HTTToan>*</HTTToan></TTChung><NDHDon><NMua><Ten>*</Ten><DChi>*</DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><THHDVu>*</THHDVu></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></ThayTheHD>`
    },
    {
      id: "tt78-get-hash-inv-smartca-token",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.6",
      name: "getHashInvSmartCAToken",
      description: "Thực hiện điều chỉnh, thay thế hóa đơn cũ (hóa đơn không tồn tại trên hệ thống) sử dụng token (Bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "accPass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "invXml", type: "string", required: true, description: "String XML dữ liệu hóa đơn điều chỉnh, thay thế" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "oldPattern", type: "string", required: true, description: "Mẫu số hóa đơn cũ" },
        { name: "oldSerial", type: "string", required: true, description: "Ký hiệu hóa đơn cũ" },
        { name: "oldNo", type: "decimal", required: true, description: "Số hóa đơn cũ" },
        { name: "strOldArisingDate", type: "string", required: true, description: "Ngày hóa đơn cũ (dd/MM/yyyy)" },
        { name: "typeSign", type: "int", required: true, description: "phát hành mới: 0, thay thế: 1, điều chỉnh tăng: 2, điều chỉnh giảm: 3, điều chỉnh thông tin: 4" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" },
        { name: "relatedInvType", type: "int", required: false, description: "Loại hóa đơn liên quan, mặc định 3" }
      ],
      responseParams: [
        { code: "chuỗi xml", message: "Trả về XML chứa hashValue" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy công ty" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn hoặc lỗi hệ thống" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:12", message: "Ngày hóa đơn cũ không hợp lệ" },
        { code: "ERR:20", message: "Tham số pattern and serial không hợp lệ" },
        { code: "ERR:21", message: "Tài khoản không tồn tại" },
        { code: "ERR:22", message: "Không tìm thấy keystores" },
        { code: "ERR:24", message: "Chứng thư không dùng" },
        { code: "ERR:27", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:28", message: "Chứng thư chưa có trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "tt78-adjust-replace-without-inv-smartca",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.7",
      name: "AdjustReplaceWithoutInvSmartCA",
      description: "Gửi điều chỉnh, thay thế hóa đơn cũ (không tồn tại trong hệ thống) sử dụng token smart CA (Bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "0: mới, 1: thay thế, 2: điều chỉnh tăng, 3: giảm, 4: thông tin" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế và điều chỉnh" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra hóa đơn" },
        { code: "ERR:8", message: "Hóa đơn điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế" },
        { code: "ERR:20", message: "Không tìm thấy dải hóa đơn" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue><LDo></LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh></Inv></Invoices>`
    },
    {
      id: "tt78-get-hash-without-inv-smartca",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.8",
      name: "GetHashWithOutInvSmartCA",
      description: "Lấy giá trị Hash cho điều chỉnh thay thế không tồn tại hóa đơn cũ với Smart CA(Bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn điều chỉnh, thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial chứng thư số" },
        { name: "type", type: "int", required: true, description: "0: mới, 1: thay thế, 2: điều chỉnh tăng, 3: giảm, 4: thông tin" },
        { name: "oldPattern", type: "string", required: true, description: "Mẫu số hóa đơn cũ" },
        { name: "oldSerial", type: "string", required: true, description: "Ký hiệu hóa đơn cũ" },
        { name: "oldNo", type: "decimal", required: true, description: "Số hóa đơn cũ" },
        { name: "strOldArisingDate", type: "string", required: true, description: "Ngày hóa đơn cũ (dd/MM/yyyy)" },
        { name: "oldInvType", type: "int", required: true, description: "Loại hóa đơn cũ" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "chuỗi xml", message: "Trả về XML chứa hashValue" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy công ty" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn hoặc lỗi hệ thống" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:12", message: "Ngày hóa đơn cũ không hợp lệ" },
        { code: "ERR:20", message: "Tham số pattern and serial không hợp lệ" },
        { code: "ERR:21", message: "Tài khoản không tồn tại" },
        { code: "ERR:22", message: "Không tìm thấy keystores" },
        { code: "ERR:24", message: "Chứng thư không dùng" },
        { code: "ERR:27", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:28", message: "Chứng thư chưa có trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "tt78-adjust-replace-without-inv-smartca-step2",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.9",
      name: "AdjustReplaceWithOutInvSmartCA",
      description: "Gửi điều chỉnh, thay thế không tồn tại hóa đơn cũ với smart CA (Bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "0: mới, 1: thay thế, 2: điều chỉnh tăng, 3: giảm, 4: thông tin" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế và điều chỉnh" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:8", message: "Hóa đơn điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế" },
        { code: "ERR:20", message: "Không tìm thấy dải hóa đơn" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue><LDo></LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh></Inv></Invoices>`
    },
    {
      id: "tt78-get-hash-without-inv-token",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.10",
      name: "GetHashWithOutInvToken",
      description: "Lấy giá trị Hash cho điều chỉnh thay thế không tồn tại hóa đơn cũ với Token (Bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu hóa đơn điều chỉnh, thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial chứng thư số" },
        { name: "type", type: "int", required: true, description: "0: mới, 1: thay thế, 2: điều chỉnh tăng, 3: giảm, 4: thông tin" },
        { name: "oldPattern", type: "string", required: true, description: "Mẫu số hóa đơn cũ" },
        { name: "oldSerial", type: "string", required: true, description: "Ký hiệu hóa đơn cũ" },
        { name: "oldNo", type: "decimal", required: true, description: "Số hóa đơn cũ" },
        { name: "strOldArisingDate", type: "string", required: true, description: "Ngày hóa đơn cũ (dd/MM/yyyy)" },
        { name: "oldInvType", type: "int", required: true, description: "Loại hóa đơn cũ" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "chuỗi xml", message: "Trả về XML chứa hashValue" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tìm thấy công ty" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được hóa đơn hoặc lỗi hệ thống" },
        { code: "ERR:7", message: "User name không phù hợp" },
        { code: "ERR:12", message: "Ngày hóa đơn cũ không hợp lệ" },
        { code: "ERR:20", message: "Tham số pattern and serial không hợp lệ" },
        { code: "ERR:21", message: "Tài khoản không tồn tại" },
        { code: "ERR:22", message: "Không tìm thấy keystores" },
        { code: "ERR:24", message: "Chứng thư không dùng" },
        { code: "ERR:27", message: "Lỗi chứng thư hết hạn" },
        { code: "ERR:28", message: "Chứng thư chưa có trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "tt78-adjust-replace-without-inv-token",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.11",
      name: "AdjustReplaceWithOutInvToken",
      description: "Gửi điều chỉnh, thay thế không tồn tại hóa đơn cũ với Token (Bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "0: mới, 1: thay thế, 2: điều chỉnh tăng, 3: giảm, 4: thông tin" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:2", message: "Không tồn tại hóa đơn cần thay thế và điều chỉnh" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:8", message: "Hóa đơn điều chỉnh hoặc thay thế chưa phát hành hoặc đã điều chỉnh không được thay thế" },
        { code: "ERR:20", message: "Không tìm thấy dải hóa đơn" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư số" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng" },
        { code: "ERR:26", message: "Chứng thư số hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue><LDo></LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh></Inv></Invoices>`
    },
    {
      id: "tt78-adjust-replace-inv-smartca",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.12",
      name: "AdjustReplaceInvSmartCA",
      description: "Thay thế, điều chỉnh hóa đơn sử dụng SmartCa (Bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml thông tin hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "1: thay thế, 2: điều chỉnh tăng, 3: giảm, 4: thông tin" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành hóa đơn thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:6", message: "Không còn đủ số lượng hóa đơn để phát hành" },
        { code: "ERR:10", message: "Lô có số hóa đơn vượt quá max cho phép" },
        { code: "ERR:20", message: "Không tìm thấy dải hóa đơn" },
        { code: "ERR:21", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" },
        { code: "ERR:22", message: "Công ty chưa đăng ký chứng thư" },
        { code: "ERR:24", message: "Chứng thư truyền lên không đúng" },
        { code: "ERR:26", message: "Chứng thư hết hạn" },
        { code: "ERR:27", message: "Chứng thư chưa đến thời điểm sử dụng" },
        { code: "ERR:28", message: "Chưa có thông tin chứng thư trong hệ thống" },
        { code: "ERR:30", message: "Tạo mới hóa đơn có lỗi" },
        { code: "ERR:35", message: "Bắt buộc truyền pattern, serial do công ty đăng ký cả có mã và không mã" },
        { code: "ERR:60", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại" },
        { code: "ERR:61", message: "Chỉ được phép điều chỉnh hóa đơn cùng loại (HD GTGT / HD bán hàng...)" },
        { code: "ERR:62", message: "Không được dùng không mã đăng ký gửi bảng tổng hợp" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue><LDo></LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh></Inv></Invoices>`
    },
    {
      id: "tt78-get-company-config",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.13",
      name: "getCompanyConfig",
      description: "Lấy thông tin config của công ty.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "configKey", type: "string", required: true, description: "key config" }
      ],
      responseParams: [
        { code: "OK: stringBase64", message: "Base64 của config" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Mã thông điệp không thuộc công ty tra cứu" },
        { code: "ERR:4", message: "Key null" },
        { code: "ERR:5", message: "Có lỗi xảy ra" },
        { code: "ERR:7", message: "Không tìm thấy công ty hoặc tài khoản không tồn tại" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-import-and-sign-record",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.14",
      name: "ImportAndSignRecord",
      description: "Tạo mới và ký phát hành biên bản điện tử.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlRecordData", type: "string", required: true, description: "chuỗi xml thông tin biên bản đầu vào" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: false, description: "Serial chứng thư số" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "Base64 của xml đầu ra", message: "DSBBan dạng XML đã base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập/tài khoản ServiceRole sai hoặc không có quyền" },
        { code: "ERR:3", message: "Định dạng xml của biên bản sai cấu trúc" },
        { code: "ERR:4", message: "Có lỗi trong quá trình DeserializeRecord từ xml biên bản" },
        { code: "ERR:5", message: "Lỗi hệ thống" },
        { code: "ERR:29", message: "Không tìm thấy keystore hoặc Chứng thư đã hết hạn" },
        { code: "ERR:51", message: "Chứng thư số bị thu hồi" },
        { code: "ERR:2101", message: "Không tìm thấy công ty" },
        { code: "ERR:2102", message: "Không tìm thấy tài khoản người dùng" },
        { code: "ERR:2902", message: "Không tìm thấy chứng thư số cert" },
        { code: "ERR:2903", message: "Chứng thư số không hợp lệ X509Certificate2 null" }
      ],
      xmlTemplate: `<DSBBan><BBan><NDBBan><TTChung><SBBan>*</SBBan><NBBan>*</NBBan><TCHDon>2</TCHDon><CVNDDPLNBan></CVNDDPLNBan><NMua></NMua><HVTNMua></HVTNMua><MSTNMua></MSTNMua><DCNMua></DCNMua><MDVQHNSNMua></MDVQHNSNMua><CCCDNMua></CCCDNMua><SHCNMua></SHCNMua><MKHang></MKHang><SDTNMua></SDTNMua><DCTDTNMua></DCTDTNMua><NDDPLNMua></NDDPLNMua><CVNDDPLNMua></CVNDDPLNMua><DSHDon><HDon><KHMSHDon></KHMSHDon><KHHDon></KHHDon><SHDon></SHDon><LDo></LDo><NDTDChinh></NDTDChinh><NDSDChinh></NDSDChinh></HDon></DSHDon></TTChung></NDBBan></BBan></DSBBan>`
    },
    {
      id: "tt78-get-hash-record-by-token-or-smartca",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.15",
      name: "GetHashRecordByTokenOrSmartCA",
      description: "Lấy hash biên bản điện tử của token hoặc smartca (Bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlRecordData", type: "string", required: true, description: "Chuỗi xml chứa thông tin biên bản" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial chứng thư số" },
        { name: "typeCert", type: "int", required: true, description: "4 là token, 6 là smartca" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "Base64 của xml đầu ra", message: "DSBBan có chứa HashValue dạng XML đã base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Định dạng xml của biên bản sai cấu trúc" },
        { code: "ERR:4", message: "Có lỗi trong quá trình DeserializeRecord từ xml biên bản" },
        { code: "ERR:5", message: "Lỗi hệ thống" },
        { code: "ERR:10", message: "Thông tin chứng thư số không hợp lệ: serialCert null" },
        { code: "ERR:11", message: "Loại chứng thư typeCert không đúng loại chữ ký số của đơn vị đăng ký" },
        { code: "ERR:29", message: "Không tìm thấy keystore hoặc Chứng thư đã hết hạn" },
        { code: "ERR:51", message: "Chứng thư số bị thu hồi" },
        { code: "ERR:2101", message: "Không tìm thấy công ty" },
        { code: "ERR:2102", message: "Không tìm thấy tài khoản người dùng" },
        { code: "ERR:2902", message: "Không tìm thấy chứng thư số cert" },
        { code: "ERR:2903", message: "Chứng thư số không hợp lệ X509Certificate2 null" }
      ],
      xmlTemplate: `<DSBBan><BBan><SBBan>*</SBBan><HashValue>*</HashValue><Message></Message></BBan></DSBBan>`
    },
    {
      id: "tt78-sign-record-by-token-or-smartca",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.16",
      name: "SignRecordByTokenOrSmartCA",
      description: "Ký phát hành biên bản điện tử bằng token hoặc smartca (Bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlRecordData", type: "string", required: true, description: "Chuỗi xml chứa thông tin biên bản" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial chứng thư số" },
        { name: "typeCert", type: "int", required: true, description: "4 là token, 6 là smartca" }
      ],
      responseParams: [
        { code: "Base64 của xml đầu ra", message: "DSBBan dạng XML đã base64" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu XML đầu vào không hợp lệ hoặc Lỗi Cache ListRecord null" },
        { code: "ERR:4", message: "Có lỗi trong quá trình DeserializeRecord từ xml biên bản" },
        { code: "ERR:5", message: "Lỗi hệ thống" },
        { code: "ERR:10", message: "Thông tin chứng thư số không hợp lệ: serialCert null" },
        { code: "ERR:11", message: "Loại chứng thư typeCert không đúng loại chữ ký số của đơn vị đăng ký" },
        { code: "ERR:29", message: "Không tìm thấy keystore hoặc Chứng thư đã hết hạn" },
        { code: "ERR:51", message: "Chứng thư số bị thu hồi" },
        { code: "ERR:2101", message: "Không tìm thấy công ty" },
        { code: "ERR:2102", message: "Không tìm thấy tài khoản người dùng" },
        { code: "ERR:2902", message: "Không tìm thấy chứng thư số cert" },
        { code: "ERR:2903", message: "Chứng thư số không hợp lệ X509Certificate2 null" }
      ],
      xmlTemplate: `<DSBBan><BBan><SBBan>*</SBBan><HashValue>*</HashValue><SignValue>*</SignValue></BBan></DSBBan>`
    },
    {
      id: "tt78-get-record-by-inv-token",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.17",
      name: "GetRecordByInvToken",
      description: "Lấy thông tin và XMLData biên bản theo list token (mẫu số, ký hiệu, số hoá đơn) truyền vào.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "lstInvToken", type: "string", required: true, description: "Danh sách token (mẫu số;ký hiệu;số hoá đơn)" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "typeDownload", type: "int", required: true, description: "0: download xml, 1: download pdf, 2: download html" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Tuỳ thuộc vào type để trả ra XML (0), PDF Base64 (1), hoặc HTML Base64 (2)" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền lấy biên bản" },
        { code: "ERR:3", message: "lstInvToken null" },
        { code: "ERR:4", message: "Lỗi số InvToken truyền vào lớn hơn 500" },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu biên bản" },
        { code: "ERR:2101", message: "Không tìm thấy công ty" },
        { code: "ERR:2102", message: "Không tìm thấy tài khoản người dùng" }
      ],
      xmlTemplate: `<DSHDon><HDon><KHMSHDon>*</KHMSHDon><KHHDon>*</KHHDon><SHDon>*</SHDon><DSBBan><BBan><SBBan>*</SBBan><NBBan>*</NBBan><TCHDon>*</TCHDon><TTNMua>*</TTNMua><Data>*</Data></BBan></DSBBan></HDon></DSHDon>`
    },
    {
      id: "tt78-get-record-by-fkey",
      serviceGroupId: "tt78-business",
      sectionNumber: "3.2.18",
      name: "GetRecordByFkey",
      description: "Lấy biên bản theo Fkey hoá đơn.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "lstFkey", type: "string", required: true, description: "Danh sách fkey hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "typeDownload", type: "int", required: true, description: "0: download xml, 1: download pdf, 2: download html" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Tuỳ thuộc vào type để trả ra XML (0), PDF Base64 (1), hoặc HTML Base64 (2)" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền lấy biên bản" },
        { code: "ERR:3", message: "lstFkey null" },
        { code: "ERR:4", message: "Lỗi số InvToken truyền vào lớn hơn 500" },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu biên bản" },
        { code: "ERR:2101", message: "Không tìm thấy công ty" },
        { code: "ERR:2102", message: "Không tìm thấy tài khoản người dùng" }
      ],
      xmlTemplate: `<DSHDon><HDon><Fkey>*</Fkey><DSBBan><BBan><SBBan>*</SBBan><NBBan>*</NBBan><TCHDon>*</TCHDon><TTNMua>*</TTNMua><Data>*</Data></BBan></DSBBan></HDon></DSHDon>`
    },// ==========================================================
    // CHƯƠNG 4: DANH SÁCH CÁC HÀM CHỨNG TỪ KHẤU TRỪ THUẾ TNCN (CTT)
    // ==========================================================
    {
      id: "ctt-import-and-publish",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.1",
      name: "ImportAndPublishCTT",
      description: "Phát hành chứng từ với dữ liệu XML của khách hàng, tối đa cho 5000 chứng từ.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu chứng từ" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0 (0: Không convert, 1: Convert TCVN3 sang Unicode)" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1,key2_num12, …", message: "Đã phát hành chứng từ thành công" },
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền" },
        { code: "ERR:3", message: "Dữ liệu xml đầu vào không đúng quy định" },
        { code: "ERR:5", message: "Không phát hành được chứng từ" },
        { code: "ERR:13", message: "Lỗi trùng fkey" }
      ],
      xmlTemplate: `<DSCTu><CTu><key>*</key><DLCTu><TTChung><NLap>*</NLap><TTKhac><TTin><TTruong></TTruong><KDLieu></KDLieu><DLieu></DLieu></TTin></TTKhac></TTChung><NDCTu><NNT><Ten>*</Ten><MKHang></MKHang><MST></MST><DChi>*</DChi><QTich></QTich><CNCTru>*</CNCTru><CMND></CMND><DCTDTu></DCTDTu><SDThoai>*</SDThoai><GChu></GChu></NNT><TTNCNKTru><KTNhap>*</KTNhap><TThang>*</TThang><DThang>*</DThang><Nam>*</Nam><TThien>*</TThien><TTNCThue>*</TTNCThue><TTNTThue>*</TTNTThue><SThue>*</SThue><BHiem>*</BHiem></TTNCNKTru></NDCTu></DLCTu></CTu></DSCTu>`
    },
    {
      id: "ctt-get-hash-with-token",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.2",
      name: "getHashCTTWithToken",
      description: "Phát hành chứng từ với các hệ thống sử dụng token, thực hiện truyền dữ liệu chứng từ và lấy giá trị hash value để ký số bằng token ở client (bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi xml chứng từ" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4" },
        { name: "invToken", type: "string", required: true, description: "chuỗi token chứng từ" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi trả về chứa hashValue" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "ctt-publish-with-token",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.3",
      name: "publishCTTWithToken",
      description: "Phát hành chứng từ với các hệ thống sử dụng token, sau khi thực hiện gọi hàm Lấy giá trị Hash (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash hóa" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành chứng từ thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "ctt-get-hash-smartca",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.4",
      name: "GetHashCTTSmartCA",
      description: "Phát hành chứng từ với các hệ thống sử dụng smartCA, lấy giá trị hash value (bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml chứng từ" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, v.v." },
        { name: "invToken", type: "string", required: true, description: "chuỗi token chứng từ" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi trả về chứa hashValue" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "ctt-publish-smartca",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.5",
      name: "PublishCTTSmartCA",
      description: "Phát hành chứng từ với các hệ thống sử dụng SmartCA (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash hóa" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành chứng từ thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "ctt-register-publish-ctt",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.6",
      name: "RegisterPublishCTT",
      description: "Đăng ký tờ khai 01 đối với chứng từ.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu tờ khai 01 đã ký số" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "=0" }
      ],
      responseParams: [
        { code: "OK: mtd", message: "Đã gửi tờ khai 01 lên TCT: mã thông điệp" }
      ],
      xmlTemplate: `<TKhai><DLTKhai Id="DuLieuKy"><TTChung><PBan>2.1.0</PBan><MSo>01/ĐKTĐ-CTĐT</MSo><Ten>*</Ten><HThuc>*</HThuc><TNNT>*</TNNT><MST>*</MST><CQTQLy>*</CQTQLy><MCQTQLy>*</MCQTQLy><NLHe>*</NLHe><DCLHe>*</DCLHe><DCTDTu>*</DCTDTu><DTLHe>*</DTLHe><DDanh>*</DDanh><NLap>*</NLap></TTChung><NDTKhai><DTPHanh><TCCNPHanh>*</TCCNPHanh><CQTPHanh>*</CQTPHanh></DTPHanh><LHSDung><CTTNCNhan>*</CTTNCNhan><CTKTTTMDTu>*</CTKTTTMDTu><BLTPLPKIn>*</BLTPLPKIn><BLTPLPIn>*</BLTPLPIn><BLTTPLPhi>*</BLTTPLPhi></LHSDung><HTGDLCTDT><CDLQCCQT>*</CDLQCCQT><CDLQTCTN>*</CDLQTCTN><CDLQTCTNUT>*</CDLQTCTNUT></HTGDLCTDT><DSCTSSDung><CTS><TTChuc>*</TTChuc><Seri>*</Seri><TNgay>*</TNgay><DNgay>*</DNgay><HThuc>*</HThuc></CTS></DSCTSSDung></NDTKhai></DLTKhai></TKhai>`
    },
    {
      id: "ctt-import-inv-by-pattern",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.1.7",
      name: "ImportInvByPatternCTT",
      description: "Thêm mới chứng từ điện tử từ dữ liệu XML gửi lên.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml chứng từ" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK: pattern;serial1-key1_num1...", message: "Đã tạo mới chứng từ thành công" }
      ],
      xmlTemplate: `<DSCTu><CTu><key>*</key><DLCTu><TTChung><NLap>*</NLap></TTChung><NDCTu><NNT><Ten>*</Ten><MST></MST><DChi>*</DChi><CNCTru>*</CNCTru><CMND></CMND><SDThoai>*</SDThoai></NNT><TTNCNKTru><KTNhap>*</KTNhap><TThang>*</TThang><DThang>*</DThang><Nam>*</Nam><TThien>*</TThien><TTNCThue>*</TTNCThue><TTNTThue>*</TTNTThue><SThue>*</SThue><BHiem>*</BHiem></TTNCNKTru></NDCTu></DLCTu></CTu></DSCTu>`
    },
    {
      id: "ctt-replace-ctt-action",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.2.1",
      name: "ReplaceCTTAction",
      description: "Thực hiện thay thế chứng từ (HSM).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu chứng từ cũ và chứng từ thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định chứng từ cần thay thế" },
        { name: "Attachfile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành chứng từ thay thế" }
      ],
      xmlTemplate: `<ThayTheCT><key>*</key><TTChung><NLap>*</NLap></TTChung><NDCTu><NNT><Ten>*</Ten><MST></MST><DChi>*</DChi><CNCTru>*</CNCTru><CMND></CMND><SDThoai>*</SDThoai></NNT><TTNCNKTru><KTNhap>*</KTNhap><TThang>*</TThang><DThang>*</DThang><Nam>*</Nam><TThien>*</TThien><TTNCThue>*</TTNCThue><TTNTThue>*</TTNTThue><SThue>*</SThue><BHiem>*</BHiem></TTNCNKTru></NDCTu></ThayTheCT>`
    },
    {
      id: "ctt-get-hash-token-replace",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.2.2",
      name: "getHashCTTTokenReplace",
      description: "Lấy giá trị Hash thay thế chứng từ sử dụng token (bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml chứng từ" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1" },
        { name: "invToken", type: "string", required: true, description: "chuỗi token chứng từ" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi trả về chứa hashValue" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "ctt-adjust-replace-token",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.2.3",
      name: "AdjustReplaceCTTToken",
      description: "Gửi thay thế chứng từ sử dụng token (bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "thay thế = 1" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành chứng từ thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "ctt-get-hash-smartca-replace",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.2.4",
      name: "GetHashCTTSmartCAReplace",
      description: "Lấy giá trị Hash thay thế chứng từ sử dụng smartCA (bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml chứng từ" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1" },
        { name: "invToken", type: "string", required: true, description: "chuỗi token chứng từ" },
        { name: "pattern", type: "string", required: false, description: "mẫu số chứng từ" },
        { name: "serial", type: "string", required: false, description: "ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi trả về chứa hashValue" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "ctt-adjust-replace-smartca",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.2.5",
      name: "AdjustReplaceCTTSmartCA",
      description: "Gửi thay thế chứng từ sử dụng smartCA (bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "thay thế = 1" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành chứng từ thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "ctt-cancel-inv-ctt",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.3.1",
      name: "cancelInvCTT",
      description: "Hủy chứng từ (chỉ cho phép Hủy chứng từ không gửi lên CQT theo mẫu cũ trước 1/6/2025).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "Fkey", type: "string", required: true, description: "Chuỗi xác định chứng từ cần hủy" },
        { name: "functionName", type: "string", required: true, description: "CancelInv hủy không ký biên bản , cancelInvSignFile: hủy tạo file biên bản" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "note", type: "string", required: false, description: "ghi chú biên bản" }
      ],
      responseParams: [
        { code: "OK:", message: "Hủy chứng từ thành công" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "ctt-adjust-ctt-action",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.3.2",
      name: "AdjustCTTAction",
      description: "Điều chỉnh chứng từ (API mới) (HSM). Lưu ý chỉ điều chỉnh chứng từ ND70, không được điều chỉnh chứng từ ND123.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "String XML dữ liệu chứng từ cũ và chứng từ điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định chứng từ cần điều chỉnh" },
        { name: "AttachFile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu" }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Đã phát hành chứng từ thành công" }
      ],
      xmlTemplate: `<DieuChinhCT><key>*</key><TTChung><NLap>*</NLap></TTChung><NDCTu><NNT><Ten>*</Ten><MST></MST><DChi>*</DChi><CNCTru>*</CNCTru><CMND></CMND><SDThoai>*</SDThoai></NNT><TTNCNKTru><KTNhap>*</KTNhap><TThang>*</TThang><DThang>*</DThang><Nam>*</Nam><TThien>*</TThien><TTNCThue>*</TTNCThue><TTNTThue>*</TTNTThue><SThue>*</SThue><BHiem>*</BHiem></TTNCNKTru></NDCTu></DieuChinhCT>`
    },
    {
      id: "ctt-download-token",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.4.1",
      name: "downloadCTTToken",
      description: "Download chứng từ token.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "token", type: "string", required: true, description: "Chuỗi token xác định cần lấy cần lấy" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: false, description: "type = 0 download xml, type=1 download pdf, type=2 download html" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với chứng từ, hoặc base64 của pdf/html" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "ctt-download-fkey",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.4.2",
      name: "downloadCTTFkey",
      description: "Download chứng từ Fkey.",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Chuỗi fkey xác định chứng từ cần lấy" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: false, description: "type = 0 download xml, type=1 download pdf, type=2 download html" }
      ],
      responseParams: [
        { code: "chuỗi_Xml_trả_về", message: "Trả về chuỗi Xml tương ứng với chứng từ, hoặc base64 của pdf/html" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "ctt-send-notice-errors",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.5.1",
      name: "SendCTTNoticeErrors",
      description: "Gửi thông điệp chứng từ điện tử có sai sót (API mới).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp chứng từ điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: false, description: "serial chứng thư số" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: `<DLTBao><TNNT></TNNT><TCQT></TCQT><NTBao></NTBao><DDanh></DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSCTu><CTu><STT></STT><KHMSCTu>*</KHMSCTu><KHCTu>*</KHCTu><SCTu>*</SCTu><NLap>*</NLap><LADHDDT>*</LADHDDT><TCTBao>*</TCTBao><LDo></LDo><Fkey></Fkey></CTu></DSCTu></DLTBao>`
    },
    {
      id: "ctt-get-hash-notice-errors-token",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.5.2",
      name: "GetHashCTTNoticeErrorsWithToken",
      description: "Lấy giá trị Hash cho gửi thông điệp chứng từ có sai sót bằng token ( bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp chứng từ điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: false, description: "serial chứng thư số" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi base64Hash", message: "Chuỗi trả về sử dụng để ký số token" }
      ],
      xmlTemplate: `<DLTBao><TNNT></TNNT><TCQT></TCQT><NTBao></NTBao><DDanh></DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSCTu><CTu><STT></STT><KHMSCTu>*</KHMSCTu><KHCTu>*</KHCTu><SCTu>*</SCTu><NLap>*</NLap><LADHDDT>*</LADHDDT><TCTBao>*</TCTBao><LDo></LDo><Fkey></Fkey></CTu></DSCTu></DLTBao>`
    },
    {
      id: "ctt-send-notice-errors-token",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.5.3",
      name: "SendCTTNoticeErrorsWithToken",
      description: "Gửi thông điệp chứng từ điện tử có sai sót sử dụng token (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: `<CKS><SerialCert>*</SerialCert><Base64Hash>*</Base64Hash><SignValue>*</SignValue></CKS>`
    },
    {
      id: "ctt-get-hash-notice-errors-smartca",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.5.4",
      name: "GetHashCTTNoticeErrorsWithSmartCA",
      description: "Lấy giá trị Hash cho gửi thông điệp chứng từ có sai sót bằng SmartCA ( bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp chứng từ điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: false, description: "serial chứng thư số" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi hash", message: "Chuỗi trả về sử dụng để ký số smartCA" }
      ],
      xmlTemplate: `<DLTBao><TNNT></TNNT><TCQT></TCQT><NTBao></NTBao><DDanh></DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSCTu><CTu><STT></STT><KHMSCTu>*</KHMSCTu><KHCTu>*</KHCTu><SCTu>*</SCTu><NLap>*</NLap><LADHDDT>*</LADHDDT><TCTBao>*</TCTBao><LDo></LDo><Fkey></Fkey></CTu></DSCTu></DLTBao>`
    },
    {
      id: "ctt-send-notice-errors-smartca",
      serviceGroupId: "ctt-service",
      sectionNumber: "4.5.5",
      name: "SendCTTNoticeErrorsWithSmartCA",
      description: "Gửi thông điệp chứng từ điện tử có sai sót sử dụng SmartCA (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: `<CKS><SerialCert>*</SerialCert><HashValue>*</HashValue><SignValue>*</SignValue></CKS>`
    },

    // ==========================================================
    // CHƯƠNG 5: DANH SÁCH CÁC HÀM HÓA ĐƠN MÁY TÍNH TIỀN (MTT)
    // ==========================================================
    {
      id: "mtt-import-and-publish",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.1",
      name: "ImportAndPublishInvMTT",
      description: "Tạo mới và phát hành hóa đơn khởi tạo từ máy tính tiền.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: true, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey_invNumber_MCCQT", message: "Trả về message OK kèm theo Pattern, Serial, danh sách fkey, danh sách số hóa đơn, mã CQT phát hành thành công" }
      ],
      xmlTemplate: `<DSHDon><HDon><key>*</key><MCCQT></MCCQT><DLHDon><TTChung><NLap>*</NLap><DVTTe>*</DVTTe><TGia></TGia><HTTToan>*</HTTToan></TTChung><NDHDon><NBan><MCHang></MCHang><TCHang></TCHang></NBan><NMua><Ten></Ten><MST></MST><DChi></DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><STT></STT><THHDVu>*</THHDVu><ThTien>*</ThTien></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></DLHDon></HDon></DSHDon>`
    },
    {
      id: "mtt-import-inv-by-pattern",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.2",
      name: "ImportInvByPatternMTT",
      description: "Tạo mới chưa phát hành hóa đơn khởi tạo từ máy tính tiền.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: true, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey1_fkey2_...", message: "Trả về message OK kèm theo Pattern, Serial, danh sách fkey" }
      ],
      xmlTemplate: `<DSHDon><HDon><key>*</key><MCCQT></MCCQT><DLHDon><TTChung><NLap>*</NLap><DVTTe>*</DVTTe><TGia></TGia><HTTToan>*</HTTToan></TTChung><NDHDon><NBan><MCHang></MCHang><TCHang></TCHang></NBan><NMua><Ten></Ten><MST></MST><DChi></DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><STT></STT><THHDVu>*</THHDVu><ThTien>*</ThTien></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></DLHDon></HDon></DSHDon>`
    },
    {
      id: "mtt-get-hash-with-token",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.3",
      name: "getHashInvWithTokenMTT",
      description: "Lấy giá trị Hash cho phát hành hóa đơn MTT bằng token ( bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, v.v." },
        { name: "invToken", type: "string", required: true, description: "chuỗi token hóa đơn" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi trả về chứa hashValue" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "mtt-publish-with-token",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.4",
      name: "publishInvWithTokenMTT",
      description: "Phát hành hóa đơn sử dụng token (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash hóa" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "mtt-adjust-replace-with-token",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.5",
      name: "AdjustReplaceInvWithTokenMTT",
      description: "Thay thế, điều chỉnh hóa đơn sử dụng token (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "type", type: "int", required: true, description: "thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, điều chỉnh thông tin = 4" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><PatternOld>*</PatternOld><SerialOld>*</SerialOld><NoOlde>*</NoOlde><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue><LDo></LDo><NDTDCHinh></NDTDCHinh><NDSDCHinh></NDSDCHinh></Inv></Invoices>`
    },
    {
      id: "mtt-get-hash-smartca",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.6",
      name: "GetHashInvSmartCAMTT",
      description: "Lấy giá trị Hash cho phát hành hóa đơn MTT bằng smartCA( bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "phát hành mới: 0, thay thế = 1, điều chỉnh tăng = 2, điều chỉnh giảm = 3, v.v." },
        { name: "invToken", type: "string", required: true, description: "chuỗi token hóa đơn" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi xml trả về", message: "Chuỗi trả về chứa hashValue" }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue><pattern>*</pattern><serial>*</serial></Inv></Invoices>`
    },
    {
      id: "mtt-publish-smartca",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.7",
      name: "PublishInvSmartCAMTT",
      description: "Phát hành hóa đơn sử dụng SmartCA (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash hóa" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thành công" }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "mtt-send-inv-error",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.8",
      name: "SendInvErrorMTT",
      description: "Gửi hóa đơn sai sót đối với máy tính tiền.",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp hóa đơn điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Ký hiệu chứng thư số" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: `<DLTBao><TNNT>*</TNNT><MST>*</MST><MCQT>*</MCQT><TCQT>*</TCQT><NTBao>*</NTBao><DDanh>*</DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSHDon><HDon><STT></STT><MCCQT></MCCQT><KHMSHDon>*</KHMSHDon><KHHDon>*</KHHDon><SHDon>*</SHDon><Ngay>*</Ngay><LADHDDT>*</LADHDDT><TCTBao>*</TCTBao><LDo></LDo><Fkey></Fkey></HDon></DSHDon></DLTBao>`
    },
    {
      id: "mtt-get-hash-inv-error",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.9",
      name: "GetHashInvErrorMTT",
      description: "Lấy giá trị hash cho NNT gửi thông điệp hóa đơn có sai sót bằng token (bước 1).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml thông điệp hóa đơn điện tử có sai sót" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "serialCert", type: "string", required: true, description: "Ký hiệu chứng thư số" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" }
      ],
      responseParams: [
        { code: "Chuỗi base64Hash", message: "Chuỗi trả về sử dụng để ký số token" }
      ],
      xmlTemplate: `<DLTBao><TNNT>*</TNNT><MST>*</MST><TCQT>*</TCQT><MCQT>*</MCQT><NTBao>*</NTBao><DDanh>*</DDanh><Loai>*</Loai><So></So><NTBCCQT></NTBCCQT><DSHDon><HDon><STT></STT><MCCQT></MCCQT><KHMSHDon>*</KHMSHDon><KHHDon>*</KHHDon><SHDon>*</SHDon><Ngay>*</Ngay><LADHDDT>*</LADHDDT><TCTBao>*</TCTBao><LDo></LDo><Fkey></Fkey></HDon></DSHDon></DLTBao>`
    },
    {
      id: "mtt-send-inv-error-token",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.1.10",
      name: "SendInvErrorMTTWithToken",
      description: "Gửi thông báo sai sót bằng token (bước 2).",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: `<CKS><SerialCert>*</SerialCert><Base64Hash>*</Base64Hash><SignValue>*</SignValue></CKS>`
    },
    {
      id: "mtt-send-inv-fkey",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.2.1",
      name: "SendInvMTTFkey",
      description: "Gửi danh sách hóa đơn khởi tạo từ máy tính tiền theo fkey đến Cơ quan thuế bằng hsm hoặc p12.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh gửi thông điệp" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "lstFkey", type: "string", required: true, description: "Chuỗi Fkey truyền vào (ví dụ Fkey1_Fkey2_Fkey3_Fkey4_Fkey5)" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số" },
        { name: "serial", type: "string", required: true, description: "ký hiệu" },
        { name: "serialCert", type: "string", required: false, description: "Serial của chứng thư số công ty đã đăng ký" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "mtt-adjust-inv",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.2.2",
      name: "AdjustInvMTT",
      description: "Điều chỉnh hóa đơn máy tính tiền.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần điều chỉnh" },
        { name: "AttachFile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu" },
        { name: "OldPattern", type: "string", required: true, description: "mẫu số hóa đơn cũ" }
      ],
      responseParams: [
        { code: "OK: pattern;serial-Fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thành công" }
      ],
      xmlTemplate: `<DieuChinhHD><key>*</key><LDo>Lý do điều chỉnh</LDo><NDTDCHinh>Nội dung trước điều chỉnh</NDTDCHinh><NDSDCHinh>Nội dung sau điều chỉnh</NDSDCHinh><MCCQT>Mã cơ quan thuế tự sinh</MCCQT><Type>2</Type><TTChung><NLap>*</NLap><DVTTe>*</DVTTe><TGia></TGia><HTTToan>*</HTTToan><HDDThu>0</HDDThu><GiamThueGTGT>0</GiamThueGTGT></TTChung><NDHDon><NBan><MCHang></MCHang><TCHang></TCHang></NBan><NMua><Ten></Ten><MST></MST><DChi></DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><STT></STT><THHDVu>*</THHDVu><ThTien>*</ThTien></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></DieuChinhHD>`
    },
    {
      id: "mtt-replace-inv",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.2.3",
      name: "ReplaceInvMTT",
      description: "Thay thế hóa đơn máy tính tiền.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "XML dữ liệu hóa đơn cũ và hóa đơn thay thế" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "pass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "fkey", type: "string", required: true, description: "Chuỗi xác định hóa đơn cần thay thế" },
        { name: "AttachFile", type: "string", required: true, description: "Đường dẫn file biên bản hoặc key để sinh biên bản tự động" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu" },
        { name: "OldPattern", type: "string", required: true, description: "mẫu số hóa đơn cũ" }
      ],
      responseParams: [
        { code: "OK: pattern;serial-Fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thay thế thành công" }
      ],
      xmlTemplate: `<ThayTheHD><key>*</key><LDo>Lý do thay thế</LDo><MCCQT>Mã cơ quan thuế tự sinh</MCCQT><TTChung><NLap>*</NLap><DVTTe>*</DVTTe><TGia></TGia><HTTToan>*</HTTToan><HDDThu>0</HDDThu><GiamThueGTGT>0</GiamThueGTGT></TTChung><NDHDon><NBan><MCHang></MCHang><TCHang></TCHang></NBan><NMua><Ten></Ten><MST></MST><DChi></DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><STT></STT><THHDVu>*</THHDVu><ThTien>*</ThTien></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></ThayTheHD>`
    },
    {
      id: "mtt-adjust-without-inv",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.2.4",
      name: "AdjustWithoutInvMTT",
      description: "Điều chỉnh hóa đơn không tồn tại trên hệ thống máy tính tiền.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "accPass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "invXml", type: "string", required: true, description: "XML dữ liệu hóa đơn cũ và hóa đơn điều chỉnh" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "oldPattern", type: "string", required: true, description: "mẫu số hóa đơn cũ" },
        { name: "oldSerial", type: "string", required: true, description: "ký hiệu hóa đơn cũ" },
        { name: "oldNo", type: "decimal", required: true, description: "số hóa đơn cũ" },
        { name: "strOldArisingDate", type: "string", required: true, description: "Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu" },
        { name: "relatedInvType", type: "int", required: false, description: "Loại hóa đơn liên quan, mặc định là 3" },
        { name: "feature", type: "string", required: false, description: "trường sẽ dùng trong tương lai" }
      ],
      responseParams: [
        { code: "OK: pattern;serial-Fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thành công" }
      ],
      xmlTemplate: `<DieuChinhHD><key>*</key><LDo>Lý do điều chỉnh</LDo><NDTDCHinh>Nội dung trước điều chỉnh</NDTDCHinh><NDSDCHinh>Nội dung sau điều chỉnh</NDSDCHinh><MCCQT>Mã cơ quan thuế tự sinh</MCCQT><Type>2</Type><TTChung><NLap>*</NLap><DVTTe>*</DVTTe><TGia></TGia><HTTToan>*</HTTToan><HDDThu>0</HDDThu><GiamThueGTGT>0</GiamThueGTGT></TTChung><NDHDon><NBan><MCHang></MCHang><TCHang></TCHang></NBan><NMua><Ten></Ten><MST></MST><DChi></DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><STT></STT><THHDVu>*</THHDVu><ThTien>*</ThTien></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></DieuChinhHD>`
    },
    {
      id: "mtt-replace-without-inv",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.2.5",
      name: "ReplaceWithoutInvMTT",
      description: "Thay thế hóa đơn không xác định hóa đơn gốc máy tính tiền.",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "account", type: "string", required: true, description: "Tài khoản nhân viên phát hành" },
        { name: "accPass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "invXml", type: "string", required: true, description: "XML dữ liệu hóa đơn cũ và hóa đơn thay thế" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "oldPattern", type: "string", required: true, description: "mẫu số hóa đơn cũ" },
        { name: "oldSerial", type: "string", required: true, description: "ký hiệu hóa đơn cũ" },
        { name: "oldNo", type: "decimal", required: true, description: "số hóa đơn cũ" },
        { name: "strOldArisingDate", type: "string", required: true, description: "Ngày hóa đơn của hóa đơn cũ, định dạng dd/MM/yyyy" },
        { name: "convert", type: "int", required: false, description: "Mặc định là 0" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu" },
        { name: "relatedInvType", type: "int", required: false, description: "Loại hóa đơn liên quan, mặc định là 3" },
        { name: "feature", type: "string", required: false, description: "trường sẽ dùng trong tương lai" }
      ],
      responseParams: [
        { code: "OK: pattern;serial-Fkey_invNumber_MCCQT", message: "Đã phát hành hóa đơn thay thế thành công" }
      ],
      xmlTemplate: `<ThayTheHD><key>*</key><LDo>Lý do thay thế</LDo><MCCQT>Mã cơ quan thuế tự sinh</MCCQT><TTChung><NLap>*</NLap><DVTTe>*</DVTTe><TGia></TGia><HTTToan>*</HTTToan><HDDThu>0</HDDThu><GiamThueGTGT>0</GiamThueGTGT></TTChung><NDHDon><NBan><MCHang></MCHang><TCHang></TCHang></NBan><NMua><Ten></Ten><MST></MST><DChi></DChi></NMua><DSHHDVu><HHDVu><TChat>*</TChat><STT></STT><THHDVu>*</THHDVu><ThTien>*</ThTien></HHDVu></DSHHDVu><TToan><TgTTTBSo>*</TgTTTBSo><TgTTTBChu>*</TgTTTBChu></TToan></NDHDon></ThayTheHD>`
    },
    {
      id: "mtt-get-hash-fkey-token",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.3.1",
      name: "GetHashInvMTTFkeyByToken",
      description: "Lấy giá trị hash cho NNT gửi hóa đơn lên CQT sử dụng token(bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "lstFkey", type: "string", required: true, description: "Chuỗi danh sách key của hóa đơn điện tử phát hành" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: true, description: "Ký hiệu mẫu số hóa đơn" },
        { name: "serialCert", type: "string", required: false, description: "Serial của chứng thư số công ty đã đăng ký trong hệ thống (token)" }
      ],
      responseParams: [
        { code: "Chuỗi base64Hash", message: "Chuỗi trả về sử dụng để ký số token" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "mtt-send-inv-fkey-token",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.3.2",
      name: "SendInvMTTFkeyByToken",
      description: "Gửi hóa đơn máy tính tiền theo danh sách fkey sử dụng token (bước 2).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh gửi thông điệp" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xml", type: "string", required: true, description: "chuỗi xml dữ liệu ký hash" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: true, description: "ký hiệu mẫu số hóa đơn" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp" }
      ],
      xmlTemplate: `<SendInv><Base64Hash></Base64Hash><SignValue></SignValue></SendInv>`
    },
    {
      id: "mtt-get-hash-fkey-smartca",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.3.3",
      name: "GetHashInvMTTFkeyBySmartCA",
      description: "Lấy giá trị hash hóa đơn máy tính tiền theo danh sách fkey sử dụng smartCA (bước 1).",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh gửi thông điệp" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "lstFkey", type: "string", required: true, description: "chuỗi danh sách fkey của hóa đơn điện tử phát hành" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "mẫu số hóa đơn" },
        { name: "serial", type: "string", required: true, description: "ký hiệu mẫu số hóa đơn" },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" }
      ],
      responseParams: [
        { code: "Chuỗi hashValue", message: "Chuỗi trả về sử dụng để ký số SmartCA" }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "get-mccqthue-from-no-to-no",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.4.1",
      name: "GetMCCQThueFromNoToNo",
      description: "Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về từ số - đến số (* tối đa 100 số hóa đơn).",
      method: "GET",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "userName", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "userPass", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "invFromNo", type: "string", required: true, description: "Từ số" },
        { name: "invToNo", type: "string", required: true, description: "Đến số" },
        { name: "invPattern", type: "string", required: true, description: "Mẫu số hóa đơn" },
        { name: "invSerial", type: "string", required: true, description: "Ký hiệu hóa đơn" },
        { name: "isXMLData", type: "bool", required: true, description: "1: có lấy xml data, 0: không lấy xml data" }
      ],
      responseParams: [
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn" },
        { code: "ERR:2", message: "Pattern và serial không được bỏ trống" },
        { code: "ERR:3", message: "Từ số - đến số không hợp lệ" },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào" },
        { code: "ERR:7", message: "Không tìm thấy thông tin công ty" },
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn" }
      ],
      xmlTemplate: `<DSHDon>\n  <HDon>\n    <KHMSHDon>Mẫu số hóa đơn</KHMSHDon>\n    <KHHDon>Ký hiệu hóa đơn</KHHDon>\n    <SHDon>Số hóa đơn</SHDon>\n    <MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue>\n    <TThai>0: Chưa gửi cơ quan thuế\n1: Đã gửi cơ quan thuế\n2: Đã được CQT chấp nhận\n3: Đã bị CQT từ chối</TThai>\n    <MTLoi>thông báo lỗi CQT trả về</MTLoi>\n    <Fkey>Fkey hóa đơn</Fkey>\n  </HDon>\n</DSHDon>`
    },
    {
      id: "get-mccqthue-by-fkeys",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.4.2",
      name: "GetMCCQThueByFkeys",
      description: "Lấy trạng thái và XMLData hóa đơn có mã, trạng thái của hóa đơn không mã gửi CQT trả về theo danh sách Fkey.",
      method: "GET",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số hóa đơn" },
        { name: "fkeys", type: "string", required: true, description: "Danh sách chuỗi fkey xác định hóa đơn cần lấy" }
      ],
      responseParams: [
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng." },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" },
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn" }
      ],
      xmlTemplate: `<DSHDon>\n  <HDon>\n    <KHMSHDon>Mẫu số hóa đơn</KHMSHDon>\n    <KHHDon>Ký hiệu hóa đơn</KHHDon>\n    <SHDon>Số hóa đơn</SHDon>\n    <MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue>\n    <TThai>0: Chưa gửi cơ quan thuế\n1: Đã gửi cơ quan thuế\n2: Đã được CQT chấp nhận\n3: Đã bị CQT từ chối</TThai>\n    <MTLoi>thông báo lỗi CQT trả về</MTLoi>\n    <Fkey>Fkey hóa đơn</Fkey>\n  </HDon>\n</DSHDon>`
    },
    {
      id: "get-mccqthue-by-invtokens-no-xmlsign",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.4.3",
      name: "GetMCCQThueByInvTokensNoXMLSign",
      description: "Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách invToken.",
      method: "GET",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "invTokens", type: "string", required: true, description: "Danh sách chuỗi token xác định hóa đơn cần lấy" }
      ],
      responseParams: [
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng." },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" },
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn" }
      ],
      xmlTemplate: `<DSHDon>\n  <HDon>\n    <KHMSHDon>Mẫu số hóa đơn</KHMSHDon>\n    <KHHDon>Ký hiệu hóa đơn</KHHDon>\n    <SHDon>Số hóa đơn</SHDon>\n    <MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue>\n    <TThai>0: Chưa gửi cơ quan thuế\n1: Đã gửi cơ quan thuế\n2: Đã được CQT chấp nhận\n3: Đã bị CQT từ chối</TThai>\n    <MTLoi>thông báo lỗi CQT trả về</MTLoi>\n    <Fkey>Fkey hóa đơn</Fkey>\n  </HDon>\n</DSHDon>`
    },
    {
      id: "get-mccqthue-by-fkeys-no-xmlsign",
      serviceGroupId: "mtt-service",
      sectionNumber: "5.4.4",
      name: "GetMCCQThueByFkeysNoXMLSign",
      description: "Lấy trạng thái hóa đơn có mã, hóa đơn không mã gửi CQT trả về theo danh sách Fkey.",
      method: "GET",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh phát hành hóa đơn" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: true, description: "Mẫu số hóa đơn" },
        { name: "fkeys", type: "string", required: true, description: "Danh sách chuỗi fkey xác định hóa đơn cần lấy" }
      ],
      responseParams: [
        { code: "ERR:1", message: "Tài khoản đăng nhập sai hoặc không có quyền thêm mới hóa đơn" },
        { code: "ERR:2", message: "Không tìm thấy hóa đơn tương ứng." },
        { code: "ERR:5", message: "Lỗi không xác định, không lấy được dữ liệu hóa đơn cấp mã theo dữ liệu truyền vào" },
        { code: "ERR:10", message: "Vượt quá số lượng 100 hóa đơn cần lấy" },
        { code: "ERR:20", message: "Không lấy được thông tin người dùng" },
        { code: "DataBase64", message: "Dữ liệu thông tin hóa đơn ở dạng XML đã base64 bao gồm: mẫu số, ký hiệu, số, trạng thái cấp mã, xml hóa đơn" }
      ],
      xmlTemplate: `<DSHDon>\n  <HDon>\n    <KHMSHDon>Mẫu số hóa đơn</KHMSHDon>\n    <KHHDon>Ký hiệu hóa đơn</KHHDon>\n    <SHDon>Số hóa đơn</SHDon>\n    <MCCQThue>Mã cơ quan thuế cấp (Trường hợp hóa đơn có mã)</MCCQThue>\n    <TThai>0: Chưa gửi cơ quan thuế\n1: Đã gửi cơ quan thuế\n2: Đã được CQT chấp nhận\n3: Đã bị CQT từ chối</TThai>\n    <MTLoi>thông báo lỗi CQT trả về</MTLoi>\n    <Fkey>Fkey hóa đơn</Fkey>\n  </HDon>\n</DSHDon>`
    }
  ]
} satisfies VnptDocumentation;
