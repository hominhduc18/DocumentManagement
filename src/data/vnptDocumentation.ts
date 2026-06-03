import type { VnptDocumentation } from "@/types/documentation";

export const vnptDocumentation = {
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
    { id: "mtt-service", name: "5. Máy tính tiền (POS)", description: "Các hàm tích hợp hóa đơn khởi tạo từ máy tính tiền có mã của CQT." }
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
      name: "ImportAndPublishInv",
      description: "Phát hành hóa đơn với dữ liệu XML, tối đa cho 5000 hóa đơn [20].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu hóa đơn" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số hóa đơn" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu hóa đơn" },
        { name: "convert", type: "int", required: false, description: "0: Không convert, 1: Convert TCVN3 sang Unicode [5]" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành thành công kèm danh sách số hóa đơn [5]." },
        { code: "ERR:13", message: "Lỗi trùng fkey [5]." }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><Invoice><CusCode>*</CusCode><CusName>*</CusName><CusAddress>*</CusAddress><CusTaxCode>*</CusTaxCode><PaymentMethod>*</PaymentMethod><Products><Product><ProdName>*</ProdName><ProdUnit>*</ProdUnit><ProdQuantity>*</ProdQuantity><ProdPrice>*</ProdPrice><VATRate>*</VATRate><IsSum>0-5</IsSum></Product></Products><Amount>*</Amount><AmountInWords>*</AmountInWords></Invoice></Inv></Invoices> [21-30]`
    },
    {
      id: "import-and-publish-assigned-no",
      serviceGroupId: "basic-publish",
      name: "ImportAndPublishAssignedNo",
      description: "Phát hành hóa đơn cho phép truyền số hóa đơn cụ thể (InvoiceNo) [31].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "XML chứa thẻ <InvoiceNo> [32]" }
      ],
      responseParams: [
        { code: "ERR:31", message: "Số hóa đơn truyền vào không hợp lệ [33]." }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><Invoice><InvoiceNo>*</InvoiceNo>...</Invoice></Inv></Invoices>`
    },
    {
      id: "get-hash-inv-with-token",
      serviceGroupId: "basic-publish",
      name: "getHashInvWithToken",
      description: "Bước 1: Lấy giá trị Hash để ký số bằng USB Token [34].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số" },
        { name: "type", type: "int", required: true, description: "0:Mới, 1:Thay thế, 2:Tăng, 3:Giảm, 4:Thông tin [6]" },
        { name: "invToken", type: "string", required: false, description: "Dùng khi thay thế/điều chỉnh" }
      ],
      responseParams: [
        { code: "XML", message: "Trả về chuỗi XML chứa <hashValue> cho từng hóa đơn [35]." }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue></Inv></Invoices>`
    },
    {
      id: "publish-inv-with-token",
      serviceGroupId: "basic-publish",
      name: "publishInvWithToken",
      description: "Bước 2: Gửi SignValue lên hệ thống để phát hành sau khi ký Token [36].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "XML chứa <signValue> [37]" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Phát hành thành công [38]." }
      ],
      xmlTemplate: `<Invoices><SerialCert>*</SerialCert><Inv><key>*</key><idInv>*</idInv><signValue>*</signValue></Inv></Invoices>`
    },
    {
      id: "update-cus",
      serviceGroupId: "basic-publish",
      name: "UpdateCus",
      description: "Cập nhật hoặc thêm mới danh mục khách hàng [39].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlCusData", type: "string", required: true, description: "Dữ liệu khách hàng XML [40]" }
      ],
      responseParams: [
        { code: "N", message: "Số lượng khách hàng đã cập nhật thành công (N>0) [16]." },
        { code: "-3", message: "Dữ liệu XML đầu vào sai cấu trúc [16]." }
      ],
      xmlTemplate: `<Customers><Customer><Name>*</Name><Code>*</Code><TaxCode>*</TaxCode><Address>*</Address><CusType>1:DN/0:CN</CusType></Customer></Customers>`
    },
    {
      id: "set-cccd-for-company",
      serviceGroupId: "basic-publish",
      name: "SetCCCDanForCompany",
      description: "Cập nhật CCCD người đại diện, dùng CCCD thay cho MST đơn vị bán [41].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "CCCDan", type: "string", required: true, description: "Số CCCD 12 chữ số" },
        { name: "SuDungCCCD", type: "int", required: false, description: "1: Dùng thay MST, 0: Không dùng [42]" }
      ],
      responseParams: [{ code: "OK", message: "Cập nhật thành công [42]." }],
      xmlTemplate: "N/A"
    },

    // --- CHƯƠNG 2.2: PORTAL SERVICE (TRA CỨU & DOWNLOAD) ---
    {
      id: "download-inv",
      serviceGroupId: "basic-portal",
      name: "downloadInv",
      description: "Tải chuỗi XML của hóa đơn theo Token [7].",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "invToken", type: "string", required: true },
        { name: "userName", type: "string", required: true },
        { name: "userPass", type: "string", required: true }
      ],
      responseParams: [
        { code: "chuỗi_Xml", message: "Nội dung XML hóa đơn" },
        { code: "ERR:11", message: "Hóa đơn chưa thanh toán không xem được [7]." }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "download-inv-pdf",
      serviceGroupId: "basic-portal",
      name: "downloadInvPDF",
      description: "Tải file PDF hóa đơn (trả về Base64) [43].",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [{ name: "invToken", type: "string", required: true }],
      responseParams: [{ code: "Chuỗi base64", message: "Lưu chuỗi này thành file .pdf [43]." }],
      xmlTemplate: "N/A"
    },
    {
      id: "get-inv-view",
      serviceGroupId: "basic-portal",
      name: "getInvView",
      description: "Lấy định dạng HTML để hiển thị hóa đơn [44].",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [{ name: "invToken", type: "string", required: true }],
      responseParams: [{ code: "chuỗi_html", message: "Mã nguồn HTML của hóa đơn [14]." }],
      xmlTemplate: "N/A"
    },
    {
      id: "get-link-inv-view",
      serviceGroupId: "basic-portal",
      name: "GetLinkInvView",
      description: "Lấy danh sách các link xem trực tuyến, tải XML và PDF [45].",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [{ name: "invToken", type: "string", required: true }],
      responseParams: [{ code: "Chuỗi base64", message: "XML Base64 chứa <LinkView>, <LinkXML>, <LinkPDF> [45]." }],
      xmlTemplate: "N/A"
    },

    // --- CHƯƠNG 2.3: BUSINESS SERVICE (XỬ LÝ NGHIỆP VỤ) ---
    {
      id: "confirm-payment-fkey",
      serviceGroupId: "basic-business",
      name: "confirmPaymentFkey",
      description: "Gạch nợ hóa đơn theo danh sách Fkey [46].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [{ name: "lstFkey", type: "string", required: true, description: "fkey1_fkey2 [46]" }],
      responseParams: [
        { code: "OK", message: "Gạch nợ thành công" },
        { code: "ERR:13", message: "Hóa đơn đã được gạch nợ trước đó [46]." }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "adjust-invoice-action",
      serviceGroupId: "basic-business",
      name: "AdjustInvoiceAction",
      description: "Thực hiện điều chỉnh hóa đơn đã phát hành sai sót [47].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "Dữ liệu XML điều chỉnh [48]" },
        { name: "fkey", type: "string", required: true, description: "Fkey hóa đơn gốc" },
        { name: "AttachFile", type: "string", required: false, description: "10: sinh BB tự động, 11: ký BB tự động [19]" }
      ],
      responseParams: [
        { code: "OK:pattern;serial;invNumber", message: "Điều chỉnh thành công [19]." },
        { code: "ERR:19", message: "Pattern không khớp hóa đơn gốc [19]." }
      ],
      xmlTemplate: `<AdjustInv><key>*</key><LDo>*</LDo><Type>2:Tăng/3:Giảm/4:TT/6:Kết hợp</Type><Products>...</Products></AdjustInv> [48-54]`
    },
    {
      id: "cancel-inv",
      serviceGroupId: "basic-business",
      name: "cancelInv",
      description: "Hủy hóa đơn theo Fkey (yêu cầu hóa đơn chưa thanh toán) [13].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [{ name: "Fkey", type: "string", required: true }],
      responseParams: [
        { code: "OK:", message: "Hủy thành công" },
        { code: "ERR:9", message: "Hóa đơn đã thanh toán, không được hủy [13]." }
      ],
      xmlTemplate: "N/A"
    },

    // --- CHƯƠNG 3: NGHIỆP VỤ THÔNG TƯ 78 (TT78) ---
    {
      id: "tt78-import-and-publish-inv",
      serviceGroupId: "tt78-publish",
      name: "ImportAndPublishInv",
      description: "Phát hành hóa đơn TT78, dùng thẻ <DSHDon> [55].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "XML chuẩn TT78 [56]" }
      ],
      responseParams: [{ code: "OK:...", message: "Phát hành thành công [57]." }],
      xmlTemplate: `<DSHDon><HDon><key>*</key><DLHDon><TTChung><DVTTe>*</DVTTe><HTTToan>*</HTTToan></TTChung><NDHDon><NBan>...</NBan><NMua>...</NMua><DSHHDVu><HHDVu><TChat>1-5</TChat>...</HHDVu></DSHHDVu><TToan>...</TToan></NDHDon></DLHDon></HDon></DSHDon> [56, 58-65]`
    },
    {
      id: "tt78-get-inv-data-by-fkey",
      serviceGroupId: "tt78-publish",
      name: "GetInvDataByFkey",
      description: "Lấy XML hóa đơn đã được Cơ quan thuế cấp mã [66].",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [{ name: "fkey", type: "string", required: true }],
      responseParams: [
        { code: "DataBase64", message: "Dữ liệu XML hóa đơn có mã CQT dạng Base64 [67]." },
        { code: "ERR:24", message: "Hóa đơn chưa được cấp mã [67]." }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "tt78-send-inv-notice-errors",
      serviceGroupId: "tt78-publish",
      name: "SendInvNoticeErrors",
      description: "Gửi thông báo hóa đơn có sai sót (Mẫu 04/SS-HĐĐT) lên CQT [68].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [{ name: "xml", type: "string", required: true, description: "XML thông báo 04/SS [69]" }],
      responseParams: [{ code: "OK:mtd", message: "Thành công, trả về mã thông điệp (mtd) [70]." }],
      xmlTemplate: `<DLTBao><Loai>1:NNT/2:Giải trình</Loai><DSHDon><HDon><MCQTCap>*</MCQTCap><SHDon>*</SHDon><LDo>*</LDo></HDon></DSHDon></DLTBao> [69, 71, 72]`
    },
    {
      id: "tt78-register-publish",
      serviceGroupId: "tt78-publish",
      name: "RegisterPublish",
      description: "Đăng ký tờ khai sử dụng hóa đơn điện tử (Mẫu số 01/ĐKTĐ-HĐĐT) [73].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [{ name: "xmlInvData", type: "string", required: true, description: "XML tờ khai 01 đã ký số [74]" }],
      responseParams: [{ code: "OK:mtd", message: "Gửi tờ khai thành công [75]." }],
      xmlTemplate: `<TKhai><DLTKhai Id="DuLieuKy"><TTChung><MSo>01/ĐKTĐ-HĐĐT</MSo><HThuc>1:Mới/2:Thayđổi</HThuc>...</TTChung><NDTKhai><HTHDon><CMa>1</CMa></HTHDon>...</NDTKhai></DLTKhai></TKhai> [74, 76-81]`
    },
    {
      id: "tt78-import-and-sign-record",
      serviceGroupId: "tt78-business",
      name: "ImportAndSignRecord",
      description: "Tạo mới và ký phát hành biên bản điện tử thỏa thuận sai sót (HSM/P12) [82].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [{ name: "xmlRecordData", type: "string", required: true, description: "XML dữ liệu biên bản [83]" }],
      responseParams: [{ code: "Base64", message: "XML phản hồi trạng thái biên bản [84]." }],
      xmlTemplate: `<DSBBan><BBan><NDBBan><TTChung><SBBan>*</SBBan><TCHDon>1:Thaythế/2:ĐC</TCHDon><DSHDon>...</DSHDon></TTChung></NDBBan></BBan></DSBBan> [83, 85, 86]`
    },// ==========================================================
    // CHƯƠNG 4: DANH SÁCH CÁC HÀM CHỨNG TỪ KHẤU TRỪ THUẾ TNCN (CTT)
    // ==========================================================
    
    // --- 4.1 Nhóm webservice tạo lập và phát hành (PublishService) ---
    {
      id: "import-and-publish-ctt",
      serviceGroupId: "ctt-service",
      name: "ImportAndPublishCTT",
      description: "Phát hành chứng từ khấu trừ thuế TNCN điện tử sử dụng chữ ký số HSM/P12, tối đa 5000 chứng từ mỗi lô [1].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "Account", type: "string", required: true, description: "Tài khoản nhân viên gọi lệnh" },
        { name: "ACpass", type: "string", required: true, description: "Mật khẩu nhân viên" },
        { name: "xmlInvData", type: "string", required: true, description: "Chuỗi XML dữ liệu chứng từ chuẩn Nghị định 123/145" },
        { name: "username", type: "string", required: true, description: "Tài khoản ServiceRole" },
        { name: "password", type: "string", required: true, description: "Mật khẩu ServiceRole" },
        { name: "pattern", type: "string", required: false, description: "Mẫu số chứng từ (ví dụ: 03/TNCN)" },
        { name: "serial", type: "string", required: false, description: "Ký hiệu chứng từ" },
        { name: "convert", type: "int", required: false, description: "0: Unicode, 1: Convert TCVN3 sang Unicode" }
      ],
      responseParams: [
        { code: "OK:pattern;serial1-key1_num1...", message: "Phát hành thành công, trả về mẫu số, ký hiệu và số chứng từ kèm fkey [2]." },
        { code: "ERR:13", message: "Lỗi trùng fkey của chứng từ đã phát hành [2]." },
        { code: "ERR:30", message: "Danh sách chứng từ tồn tại ngày chứng từ nhỏ hơn ngày phát hành gần nhất [2]." }
      ],
      xmlTemplate: `<DSCTu><CTu><key>*</key><DLCTu><TTChung><NLap>*</NLap></TTChung><NDCTu><NNT><Ten>*</Ten><MST>*</MST><DChi>*</DChi><CNCTru>*</CNCTru></NNT><TTNCNKTru><KTNhap>*</KTNhap><Nam>*</Nam><TTNCThue>*</TTNCThue><SThue>*</SThue></TTNCNKTru></NDCTu></DLCTu></CTu></DSCTu>`
    },
    {
      id: "ctt-get-hash-with-token",
      serviceGroupId: "ctt-service",
      name: "getHashCTTWithToken",
      description: "Bước 1: Lấy giá trị Hash để chuẩn bị ký số chứng từ bằng USB Token tại client [3].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "serialCert", type: "string", required: true, description: "Số serial chứng thư số token" },
        { name: "type", type: "int", required: true, description: "0: Mới, 1: Thay thế, 2: Điều chỉnh" },
        { name: "invToken", type: "string", required: false, description: "Mẫu số;ký hiệu;số chứng từ (chỉ dùng khi thay thế/điều chỉnh) [4]." }
      ],
      responseParams: [
        { code: "Chuỗi XML", message: "Trả về danh sách thẻ <hashValue> tương ứng với từng fkey chứng từ [5]." }
      ],
      xmlTemplate: `<Invoices><Inv><key>*</key><idInv>*</idInv><hashValue>*</hashValue></Inv></Invoices>`
    },
    {
      id: "ctt-register-publish",
      serviceGroupId: "ctt-service",
      name: "RegisterPublishCTT",
      description: "Đăng ký tờ khai sử dụng chứng từ điện tử (Mẫu số 01/ĐKTĐ-CTĐT) lên CQT [6].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "XML dữ liệu tờ khai đã ký số [7]." }
      ],
      responseParams: [
        { code: "OK: mtd", message: "Đã gửi tờ khai 01 thành công, trả về mã thông điệp (mtd) [7]." }
      ],
      xmlTemplate: `<TKhai><DLTKhai Id="DuLieuKy"><TTChung><MSo>01/ĐKTĐ-CTĐT</MSo><HThuc>1:Mới/2:Thayđổi</HThuc>...</TTChung></DLTKhai></TKhai>`
    },

    // --- 4.2 Nhóm nghiệp vụ xử lý (BusinessService) ---
    {
      id: "ctt-replace-action",
      serviceGroupId: "ctt-service",
      name: "ReplaceCTTAction",
      description: "Thực hiện phát hành chứng từ thay thế cho chứng từ sai sót (Hỗ trợ cả NĐ 70 và NĐ 123) [8].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Fkey của chứng từ gốc cần thay thế" },
        { name: "AttachFile", type: "string", required: false, description: "10: tự sinh biên bản, 11: tự ký biên bản [9]." }
      ],
      responseParams: [
        { code: "OK: pattern;serial;invNumber", message: "Thay thế chứng từ thành công [10]." },
        { code: "ERR:8", message: "Chứng từ đã được thay thế trước đó, không thể thực hiện tiếp [10]." }
      ],
      xmlTemplate: `<ThayTheCT><key>*</key><TTChung>...</TTChung><NDCTu>...</NDCTu></ThayTheCT>`
    },
    {
      id: "ctt-cancel-inv",
      serviceGroupId: "ctt-service",
      name: "cancelInvCTT",
      description: "Hủy chứng từ TNCN (Lưu ý: Chỉ áp dụng cho mẫu cũ CTT56 phát hành trước 1/6/2025 không gửi CQT) [11].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "Fkey", type: "string", required: true },
        { name: "functionName", type: "string", required: true, description: "CancelInv (không ký biên bản) hoặc cancelInvSignFile (có tạo biên bản) [12]." }
      ],
      responseParams: [{ code: "OK", message: "Hủy chứng từ thành công [12]." }],
      xmlTemplate: "N/A"
    },

    // --- 4.5 Nhóm tra cứu (PortalService) ---
    {
      id: "ctt-download-fkey",
      serviceGroupId: "ctt-service",
      name: "downloadCTTFkey",
      description: "Tải dữ liệu chứng từ TNCN điện tử theo Fkey [13].",
      method: "POST",
      endpoint: "PortalService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true },
        { name: "type", type: "int", description: "0: XML, 1: PDF (Base64), 2: HTML (Base64) [13]." }
      ],
      responseParams: [{ code: "Chuỗi XML/Base64", message: "Dữ liệu chứng từ tương ứng với định dạng yêu cầu [13]." }],
      xmlTemplate: "N/A"
    },

    // ==========================================================
    // CHƯƠNG 5: DANH SÁCH CÁC HÀM HÓA ĐƠN MÁY TÍNH TIỀN (MTT)
    // ==========================================================
    
    // --- 5.1 Tạo lập và phát hành MTT (PublishService) ---
    {
      id: "mtt-import-and-publish",
      serviceGroupId: "mtt-service",
      name: "ImportAndPublishInvMTT",
      description: "Phát hành hóa đơn máy tính tiền. Hệ thống tự động sinh mã MCCQT 23 ký tự theo quy tắc [14].",
      method: "POST",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "xmlInvData", type: "string", required: true, description: "XML dữ liệu hóa đơn chuẩn MTT (có mã MCCQT rỗng) [15]." },
        { name: "pattern", type: "string", required: true, description: "Mẫu số (chỉ nhận giá trị 1, 2, 5) [16]." },
        { name: "serial", type: "string", required: true, description: "Ký hiệu có dạng CyyMxx (ví dụ: C22MTC) [16]." }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey_invNum_MCCQT", message: "Thành công, trả về số hóa đơn và mã CQT đã cấp [16]." },
        { code: "ERR:23", message: "Mã CQT rỗng hoặc hệ thống không sinh được mã [16]." }
      ],
      xmlTemplate: `<DSHDon><HDon><key>*</key><MCCQT></MCCQT><DLHDon><TTChung><NLap>yyyy-MM-dd</NLap>...</TTChung><NDHDon><NBan>...</NBan><NMua>...</NMua><DSHHDVu>...</DSHHDVu></NDHDon></DLHDon></HDon></DSHDon>`
    },

    // --- 5.2 Xử lý và Gửi thuế (BusinessService) ---
    {
      id: "mtt-send-inv-fkey",
      serviceGroupId: "mtt-service",
      name: "SendInvMTTFkey",
      description: "Gửi dữ liệu hóa đơn MTT đã phát hành lên Cơ quan thuế bằng HSM hoặc P12 theo lô [17].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstFkey", type: "string", required: true, description: "Danh sách fkey phân cách bằng dấu _ [18]." },
        { name: "serialCert", type: "string", required: false, description: "Serial chứng thư số dùng ký gửi thuế" }
      ],
      responseParams: [
        { code: "OK:mtd", message: "Gửi thông điệp thành công, trả về mã thông điệp (mtd) để tra cứu kết quả [19]." },
        { code: "ERR:12", message: "Thông điệp gửi thuế vượt quá dung lượng 1MB [19]." }
      ],
      xmlTemplate: "N/A"
    },
    {
      id: "mtt-adjust-inv",
      serviceGroupId: "mtt-service",
      name: "AdjustInvMTT",
      description: "Điều chỉnh hóa đơn máy tính tiền (Chỉ cho phép điều chỉnh cùng loại MTT) [20].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "fkey", type: "string", required: true, description: "Fkey hóa đơn gốc cần điều chỉnh" },
        { name: "Type", type: "int", description: "2: Tăng, 3: Giảm, 4: Thông tin, 6: Kết hợp [21]." }
      ],
      responseParams: [
        { code: "OK:pattern;serial-fkey_invNum_MCCQT", message: "Điều chỉnh thành công, tạo hóa đơn điều chỉnh mới có mã CQT [22]." }
      ],
      xmlTemplate: `<DieuChinhHD><key>*</key><LDo>*</LDo><MCCQT>*</MCCQT><DLHDon>...</DLHDon></DieuChinhHD>`
    },
    {
      id: "mtt-get-hash-fkey-token",
      serviceGroupId: "mtt-service",
      name: "GetHashInvMTTFkeyByToken",
      description: "Bước 1: Lấy Hash để thực hiện ký số gửi dữ liệu hóa đơn MTT lên CQT bằng USB Token [23].",
      method: "POST",
      endpoint: "BusinessService.asmx",
      requestParams: [
        { name: "lstFkey", type: "string", required: true },
        { name: "serialCert", type: "string", required: true, description: "Serial của chứng thư số token [24]." }
      ],
      responseParams: [{ code: "base64Hash", message: "Chuỗi hash dùng để ký tại client [24]." }],
      xmlTemplate: "N/A"
    },

    // --- 5.4 Tra cứu kết quả CQT (PublishService) ---
    {
      id: "mtt-get-mccqt-by-tokens-no-xml",
      serviceGroupId: "mtt-service",
      name: "GetMCCQThueByInvTokensNoXMLSign",
      description: "Lấy trạng thái và mã CQT trả về cho hóa đơn MTT (không yêu cầu dữ liệu ký XML kèm theo) [25].",
      method: "GET",
      endpoint: "PublishService.asmx",
      requestParams: [
        { name: "invTokens", type: "string", required: true, description: "Danh sách token ngăn cách bằng dấu _ [26]." }
      ],
      responseParams: [
        { code: "DataBase64", message: "XML chứa thông thái <TThai> (2: Chấp nhận, 3: Từ chối) và mã <MCCQThue> [26]." }
      ],
      xmlTemplate: `<DSHDon><HDon><KHMSHDon>*</KHMSHDon><MCCQThue>*</MCCQThue><TThai>*</TThai><MTLoi>*</MTLoi></HDon></DSHDon>`
    }
  ]
} satisfies VnptDocumentation;
