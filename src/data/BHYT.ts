import { VnptDocumentation } from '../types/documentation';

export const bhytDocumentation: VnptDocumentation = {
  title: "HƯỚNG DẪN LIÊN THÔNG DỮ LIỆU PHỤC VỤ VIỆC QUẢN LÝ, GIÁM ĐỊNH, THANH TOÁN CHI PHÍ KCB",
  version: "1.0 (QĐ 4750/QĐ-BYT)",
  lastUpdated: "2024-05-03",
  serviceGroups: [
    {
      id: "bhyt-web-service",
      name: "Dịch vụ BHYT",
      description: "Gửi dữ liệu khám bệnh, chữa bệnh thông qua dịch vụ web"
    }
  ],
  globalErrors: [
    { code: "000", message: "Thông tin thẻ BHYT chính xác" },
    { code: "001", message: "Thẻ BHYT do BHXH Bộ Quốc phòng quản lý, đề nghị kiểm tra thẻ BHYT và thông tin giấy tờ tùy thân" },
    { code: "002", message: "Thẻ BHYT do BHXH Bộ Công an quản lý, đề nghị kiểm tra thẻ BHYT và thông tin giấy tờ tùy thân" },
    { code: "003", message: "Thẻ BHYT cũ hết giá trị sử dụng, được cấp thẻ mới" },
    { code: "004", message: "Thẻ BHYT cũ còn giá trị sử dụng, được cấp thẻ mới" },
    { code: "010", message: "Thẻ BHYT hết giá trị sử dụng" },
    { code: "050", message: "Không có thông tin thẻ BHYT" },
    { code: "051", message: "Mã thẻ BHYT không đúng" },
    { code: "052", message: "Mã tỉnh cấp thẻ BHYT (ký tự thứ 4,5) của thẻ BHYT không đúng" },
    { code: "053", message: "Mã quyền lợi BHYT (ký tự thứ 3) của thẻ BHYT không đúng" },
    { code: "054", message: "Số CCCD của cán bộ thực hiện tra cứu không tồn tại trong danh sách người sử dụng do CSKCB đăng ký" },
    { code: "055", message: "Họ và tên của cán bộ thực hiện tra cứu không khớp với số CCC" },
    { code: "060", message: "Thẻ BHYT sai họ tên" },
    { code: "061", message: "Thẻ BHYT sai họ tên (đúng ký tự đầu)" },
    { code: "070", message: "Thẻ BHYT sai ngày sinh" },
    { code: "100", message: "Lỗi khi lấy dữ liệu sổ thẻ" },
    { code: "101", message: "Lỗi server" },
    { code: "110", message: "Thẻ BHYT đã thu hồi" },
    { code: "120", message: "Thẻ BHYT đã báo giảm" },
    { code: "121", message: "Thẻ BHYT đã báo giảm chuyển ngoại tỉnh" },
    { code: "122", message: "Thẻ BHYT đã báo giảm chuyển nội tỉnh" },
    { code: "123", message: "Thẻ BHYT đã báo giảm do tăng lại cùng đơn vị" },
    { code: "124", message: "Thẻ BHYT đã báo giảm ngừng tham gia" },
    { code: "130", message: "Trẻ em không xuất trình thẻ BHYT" },
    { code: "205", message: "Lỗi sai định dạng tham số" },
    { code: "401", message: "Lỗi xác thực tài khoản" }
  ],
  apis: [
    {
      id: "token-take",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1",
      name: "Dịch vụ lấy phiên làm việc",
      description: "Dịch vụ lấy token truy cập hệ thống. Content-Type: application/x-www-form-urlencoded.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/token/take",
      requestParams: [
        { name: "username", type: "String", required: true, description: "Tên tài khoản được cấp" },
        { name: "password", type: "String", required: true, description: "Mật khẩu truy cập được cấp (mã hóa MD5 uppercase)" }
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả trả về" },
        { code: "access_token", message: "Mã token truy cập hệ thống" },
        { code: "id_token", message: "Id token truy cập" },
        { code: "token_type", message: "Kiểu token truy cập" },
        { code: "username", message: "Tên đăng nhập" },
        { code: "expires_in", message: "Thời gian hết hạn token(UTC)" }
      ],
      xmlTemplate: `username=_BV&password=72C974F09D6ACA02DE639132F6275F83`
    },
    {
      id: "ko-nhan-lich-su-kcb",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "2",
      name: "Dịch vụ tra cứu thẻ BHYT và Lịch sử KCB",
      description: "Dịch vụ nhận thông tin thẻ BHYT và lịch sử khám chữa bệnh 2024.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/egw/KQNhanLichSuKCB2024?token={{access_token}}&id_token={{id_token}}&username={{username_tbadmin}}&password={{password_tb}}",
      requestParams: [
        { name: "maThe", type: "String", required: true, description: "Mã thẻ BHYT (Body)" },
        { name: "hoTen", type: "String", required: true, description: "Họ tên chủ thẻ BHYT (Body)" },
        { name: "ngaySinh", type: "String", required: true, description: "Ngày sinh (DD/MM/YYYY) (Body)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập của cơ sở khám bệnh, chữa bệnh (CSKCB) (Query)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập của CSKCB (Query)" },
        { name: "hoTenCb", type: "String", required: true, description: "Họ và tên của cán bộ thực hiện tra cứu (Body)" },
        { name: "cccdCb", type: "String", required: true, description: "Số căn cước công dân của cán bộ thực hiện tra cứu (Body)" },
        { name: "token", type: "String", required: true, description: "Token được trả về từ trước (Query)" },
        { name: "id_token", type: "String", required: true, description: "Token ID được trả về ở hàm trước (Query)" }
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch" },
        { code: "ghiChu", message: "Thông báo về giá trị sử dụng của thẻ BHYT" },
        { code: "maThe", message: "Mã thẻ BHYT hiện tại" },
        { code: "hoTen", message: "Họ tên chủ thẻ BHYT" },
        { code: "ngaySinh", message: "Ngày sinh của chủ thẻ BHYT" },
        { code: "gioiTinh", message: "Giới tính của chủ thẻ BHYT" },
        { code: "diaChi", message: "Địa chỉ của chủ thẻ BHYT" },
        { code: "maDKBD", message: "Mã CSKCB ban đầu do người tham gia BHYT đăng ký" },
        { code: "cqBHXH", message: "Tên cơ quan BHXH, nơi phát hành thẻ BHYT" },
        { code: "gtTheTu", message: "Từ ngày giá trị thẻ BHYT" },
        { code: "gtTheDen", message: "Đến ngày giá trị thẻ BHYT" },
        { code: "maKV", message: "Mã nơi đối tượng sinh sống" },
        { code: "ngayDu5Nam", message: "Thời điểm đủ 05 năm liên tục" },
        { code: "maSoBHXH", message: "Mã số BHXH" },
        { code: "maTheCu", message: "Mã thẻ BHYT cũ" },
        { code: "maTheMoi", message: "Mã thẻ BHYT mới" },
        { code: "gtTheTuMoi", message: "Từ ngày giá trị thẻ BHYT mới" },
        { code: "gtTheDenMoi", message: "Đến ngày giá trị thẻ BHYT mới" },
        { code: "maDKBDMoi", message: "Mã CSKCB ban đầu do người tham gia BHYT đăng ký mới" },
        { code: "tenDKBDMoi", message: "Tên CSKCB ban đầu do người tham gia BHYT đăng ký mới" },
        { code: "maHoSo", message: "Mã hồ sơ KCB, để tra cứu thông tin chi tiết" },
        { code: "maCSKCB", message: "Mã CSKCB" },
        { code: "ngayVao", message: "Thời điểm KCB (yyyyMMddhhmm)" },
        { code: "ngayRa", message: "Thời điểm ra viện (yyyyMMddhhmm)" },
        { code: "tenBenh", message: "Tên bệnh gồm các chẩn đoán được ghi trong hồ sơ, bệnh án" },
        { code: "tinhTrang", message: "Mã tình trạng ra viện" },
        { code: "kqDieuTri", message: "Mã kết quả điều trị" },
        { code: "lyDoVV", message: "Mã đối tượng đến khám BHYT" },
        { code: "TEMP1", message: "Mã đơn vị sử dụng lao động" },
        { code: "TEMP2", message: "Tên đơn vị sử dụng lao động" },
        { code: "userKT", message: "Tài khoản của CSKCB thực hiện tra cứu" },
        { code: "thoiGianKT", message: "Thời gian thực hiện tra cứu (định dạng yyyyMMddhhmm)" },
        { code: "thongbao", message: "Thông báo" },
        { code: "maLoi", message: "Mã lỗi" }
      ],
      xmlTemplate: `{\n  "maThe": "",\n  "hoTen": "",\n  "ngaySinh": "",\n  "hoTenCb": "",\n  "cccdCb": ""\n}`
    },
    {
      id: "check-in-kcb-qd4750",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "3",
      name: "Dịch vụ gửi dữ liệu trạng thái khám bệnh, chữa bệnh (bảng check-in)",
      description: "Dịch vụ gửi dữ liệu trạng thái khám bệnh, chữa bệnh (bảng check-in).",
      method: "POST",
      endpoint: "https://baohiemxahoi.gov.vn/api/qd130/checkInKcbQd4750",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/x-www-form-urlencoded (Header)" },
        { name: "accessToken", type: "String", required: true, description: "Token lấy được tại mục 1 (Header)" },
        { name: "tokenId", type: "String", required: true, description: "Id token lấy được tại mục 1 (Header)" },
        { name: "passwordHash", type: "String", required: true, description: "Password được mã hóa md5 (Header)" },
        { name: "username", type: "String", required: true, description: "Tên tài khoản được cấp (Body)" },
        { name: "loaiHoSo", type: "String", required: true, description: "Loại hồ sơ: mặc định điền 0 (Body)" },
        { name: "maTinh", type: "String", required: true, description: "Mã tỉnh cơ sở khám bệnh, chữa bệnh trực thuộc (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở khám bệnh, chữa bệnh (Body)" },
        { name: "fileHSBase64", type: "String", required: true, description: "File xml theo cấu trúc XML0 được mã hóa thành chuỗi base64 (Body)" }
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả trả về (200 - success, 401 unauthen, 403 - unauthoried…)" },
        { code: "maGiaoDich", message: "Mã giao dịch (lưu lại để đối chiếu)" },
        { code: "thoiGianTiepNhan", message: "Thời điểm tiếp nhận định dạng: yyyyMMddHHmmss" },
        { code: "thongDiep", message: "Thông điệp trả về, kèm theo thông điệp lỗi nếu có" }
      ],
      xmlTemplate: `<CHI_TIEU_TRANG_THAI_KCB>
<DSACH_TRANG_THAI_KCB>
<TRANG_THAI_KCB>
<MA_LK></MA_LK>
<STT></STT>
<MA_BN></MA_BN>
<HO_TEN></HO_TEN>
<SO_CCCD></SO_CCCD>
<NGAY_SINH></NGAY_SINH>
<GIOI_TINH></GIOI_TINH>
<MA_THE_BHYT></MA_THE_BHYT>
<MA_DKBD></MA_DKBD>
<GT_THE_TU></GT_THE_TU>
<GT_THE_DEN></GT_THE_DEN>
<MA_DOITUONG_KCB></MA_DOITUONG_KCB>
<NGAY_VAO></NGAY_VAO>
<NGAY_VAO_NOI_TRU></NGAY_VAO_NOI_TRU>
<LY_DO_VNT></LY_DO_VNT>
<MA_LY_DO_VNT></MA_LY_DO_VNT>
<MA_LOAI_KCB></MA_LOAI_KCB>
<MA_CSKCB></MA_CSKCB>
<MA_DICH_VU></MA_DICH_VU>
<TEN_DICH_VU></TEN_DICH_VU>
<MA_THUOC></MA_THUOC>
<TEN_THUOC></TEN_THUOC>
<MA_VAT_TU></MA_VAT_TU>
<TEN_VAT_TU></TEN_VAT_TU>
<NGAY_YL></NGAY_YL>
<DU_PHONG></DU_PHONG>
</TRANG_THAI_KCB>
<TRANG_THAI_KCB>
<MA_LK></MA_LK>
<STT></STT>
<MA_BN></MA_BN>
<HO_TEN></HO_TEN>
<SO_CCCD></SO_CCCD>
<NGAY_SINH></NGAY_SINH>
<GIOI_TINH></GIOI_TINH>
<MA_THE_BHYT></MA_THE_BHYT>
<MA_DKBD></MA_DKBD>
<GT_THE_TU></GT_THE_TU>
<GT_THE_DEN></GT_THE_DEN>
<MA_DOITUONG_KCB></MA_DOITUONG_KCB>
<NGAY_VAO></NGAY_VAO>
<NGAY_VAO_NOI_TRU></NGAY_VAO_NOI_TRU>
<LY_DO_VNT></LY_DO_VNT>
<MA_LY_DO_VNT></MA_LY_DO_VNT>
<MA_LOAI_KCB></MA_LOAI_KCB>
<MA_CSKCB></MA_CSKCB>
<MA_DICH_VU></MA_DICH_VU>
<TEN_DICH_VU></TEN_DICH_VU>
<MA_THUOC></MA_THUOC>
<TEN_THUOC></TEN_THUOC>
<MA_VAT_TU></MA_VAT_TU>
<TEN_VAT_TU></TEN_VAT_TU>
<NGAY_YL></NGAY_YL>
<DU_PHONG></DU_PHONG>
</TRANG_THAI_KCB>
</DSACH_TRANG_THAI_KCB>
<CHUKYDONVI/>
</CHI_TIEU_TRANG_THAI_KCB>`
    },
    {
      id: "gui-ho-so-xml-qd4750",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "4",
      name: "Dịch vụ gửi dữ liệu khám bệnh, chữa bệnh",
      description: "Dịch vụ gửi dữ liệu khám bệnh, chữa bệnh.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/qd130/guiHoSoXmlQD4750",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/x-www-form-urlencoded (Header)" },
        { name: "accessToken", type: "String", required: true, description: "Token lấy được tại mục 1 (Header)" },
        { name: "tokenId", type: "String", required: true, description: "Id token lấy được tại mục 1 (Header)" },
        { name: "passwordHash", type: "String", required: true, description: "Password được mã hóa md5 (Header)" },
        { name: "username", type: "String", required: true, description: "Tên tài khoản được cấp (Body)" },
        { name: "loaiHoSo", type: "String", required: true, description: "Loại hồ sơ: mặc định điền 130 (Body)" },
        { name: "maTinh", type: "String", required: true, description: "Mã tỉnh cơ sở khám bệnh, chữa bệnh trực thuộc (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở khám bệnh, chữa bệnh (Body)" },
        { name: "fileHSBase64", type: "String", required: true, description: "File xml theo cấu trúc quy định tại Quyết định số 4750/QĐ-BYT được mã hóa thành chuỗi base64 (Body)" }
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả trả về (200 - success, 401 unauthen, 403 - unauthoried…)" },
        { code: "maGiaoDich", message: "Mã giao dịch (lưu lại để đối chiếu)" },
        { code: "thoiGianTiepNhan", message: "Thời điểm tiếp nhận định dạng: yyyyMMddHHmmss" },
        { code: "thongDiep", message: "Thông điệp trả về, kèm theo thông điệp lỗi nếu có" }
      ],
      xmlTemplate: `<?xml version="1.0" encoding="utf-8"?>
<GIAMDINHHS xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<THONGTINDONVI>
<MACSKCB></MACSKCB>
</THONGTINDONVI>
<THONGTINHOSO>
<NGAYLAP></NGAYLAP>
<SOLUONGHOSO></SOLUONGHOSO>
<DANHSACHHOSO>
<HOSO>
<FILEHOSO>
<LOAIHOSO>XML1</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML2</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML3</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML4</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML5</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML6</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML7</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML8</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML9</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML10</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML11</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML13</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML14</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
<FILEHOSO>
<LOAIHOSO>XML15</LOAIHOSO>
<NOIDUNGFILE></NOIDUNGFILE>
</FILEHOSO>
</HOSO>
</DANHSACHHOSO>
</THONGTINHOSO>
<CHUKYDONVI/>
</GIAMDINHHS>`
    },
    {
      id: "gui-ho-so-giam-dinh",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.2",
      name: "Dịch vụ gửi hồ sơ giám định",
      description: "Cơ sở KCB thực hiện gửi hồ sơ giám định và nhận thông báo xác nhận kết quả nhận hồ sơ giám định của cơ quan Bảo hiểm qua hệ thống.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/egw/guiHoSoGiamDinh4210",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Query)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Query)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập, tối đa 5 ký tự (Query)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập, 6–10 ký tự (Query)" },
        { name: "loaiHoSo", type: "Int", required: true, description: "Loại hồ sơ: 3 = Hồ sơ KCB, 5 = 79/80a, 6 = 19, 7 = 20, 8 = 21, 9 = Giấy chuyển tuyến (Query)" },
        { name: "maTinh", type: "String", required: true, description: "Mã tỉnh theo Quy định 5084 (Query)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB theo Quy định 5084 (Query)" },
        { name: "fileHS", type: "Bytes", required: true, description: "Dạng bytes của file XML hồ sơ (Form data — bắt buộc)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "maGiaoDich", message: "Mã của lần giao dịch, dùng để tìm kiếm thông tin sau này" },
      ],
      xmlTemplate: "N/A",
    },
    {
      id: "gui-ho-so-tong-hop",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.3",
      name: "Dịch vụ gửi hồ sơ tổng hợp báo cáo hàng tháng/quý (79a, 80a; 19, 20, 21/BHYT)",
      description: "Gửi hồ sơ tổng hợp thanh toán BHYT định kỳ tháng/quý bao gồm các mẫu 79a, 80a, 19, 20, 21.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/egw/guiHoSoGiamDinh4210",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Query)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Query)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập, tối đa 5 ký tự (Query)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập, 6–10 ký tự (Query)" },
        {
          name: "loaiHoSo", type: "Int", required: true,
          description: "Loại hồ sơ tổng hợp: 5 = 79/80a, 6 = Mẫu 19, 7 = Mẫu 20, 8 = Mẫu 21 (Query)"
        },
        { name: "maTinh", type: "String", required: true, description: "Mã tỉnh theo Quy định 5084 (Query)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB theo Quy định 5084 (Query)" },
        { name: "fileHS", type: "Bytes", required: true, description: "Dạng bytes của file Excel tổng hợp (Form data — bắt buộc). Quy tắc đặt tên: 19_MCSKCB_NamQTThangQT_....xlsx" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "maGiaoDich", message: "Mã của lần giao dịch, dùng để tìm kiếm thông tin sau này" },
      ],
      xmlTemplate: "N/A",
    },
    {
      id: "kiem-tra-lich-su-kcb",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.4",
      name: "Dịch vụ kiểm tra lịch sử khám chữa bệnh",
      description: "Kiểm tra nhanh lịch sử khám chữa bệnh của bệnh nhân theo số thẻ BHYT hoặc mã số BHXH.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/his/checkLichSuKCB",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Header)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Header)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập (Body)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập mã hóa MD5 (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB theo Quy định 5084 (Body)" },
        { name: "maTheBHYT", type: "String", required: true, description: "Số thẻ BHYT của bệnh nhân (15 ký tự) (Body)" },
        { name: "maSoBHXH", type: "String", required: false, description: "Mã số BHXH của bệnh nhân (Body)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "coLichSu", message: "Có lịch sử KCB hay không (true/false)" },
        { code: "thongDiep", message: "Thông điệp mô tả kết quả" },
      ],
      xmlTemplate: "{\n  \"username\": \"string\",\n  \"password\": \"string\",\n  \"maCSKCB\": \"string\",\n  \"maTheBHYT\": \"string\"\n}",
    },
    {
      id: "gui-ho-so-chuyen-tuyen",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.6",
      name: "Dịch vụ gửi hồ sơ chuyển tuyến",
      description: "Gửi thông tin giấy chuyển tuyến khi cơ sở KCB chuyển bệnh nhân đến cơ sở khác.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/his/sendHoSoChuyen",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Header)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Header)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập (Body)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập mã hóa MD5 (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB gửi chuyển tuyến (Body)" },
        { name: "maCSKCBNhan", type: "String", required: true, description: "Mã cơ sở KCB nhận bệnh nhân (Body)" },
        { name: "maTheBHYT", type: "String", required: true, description: "Số thẻ BHYT bệnh nhân (Body)" },
        { name: "fileHS", type: "Bytes", required: true, description: "File XML giấy chuyển tuyến dạng bytes (Body)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "maGiaoDich", message: "Mã giao dịch chuyển tuyến — lưu lại để đối chiếu" },
        { code: "thongDiep", message: "Thông điệp trả về kèm mô tả lỗi nếu có" },
      ],
      xmlTemplate: "N/A",
    },
    {
      id: "nhan-ho-so-chuyen-tuyen",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.7",
      name: "Dịch vụ nhận hồ sơ chuyển tuyến",
      description: "Cơ sở KCB nhận thông tin giấy chuyển tuyến từ cơ sở khác gửi đến qua hệ thống BHXH.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/his/receiveHoSoChuyen",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Header)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Header)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập (Body)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập mã hóa MD5 (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB nhận bệnh nhân (Body)" },
        { name: "maTheBHYT", type: "String", required: true, description: "Số thẻ BHYT bệnh nhân (Body)" },
        { name: "maGiaoDichChuyen", type: "String", required: true, description: "Mã giao dịch chuyển tuyến nhận từ mục 1.6 (Body)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "thongTinChuyen", message: "Thông tin giấy chuyển tuyến (object)" },
        { code: "thongDiep", message: "Thông điệp trả về kèm mô tả lỗi nếu có" },
      ],
      xmlTemplate: "{\n  \"username\": \"string\",\n  \"password\": \"string\",\n  \"maCSKCB\": \"string\",\n  \"maTheBHYT\": \"string\",\n  \"maGiaoDichChuyen\": \"string\"\n}",
    },
    {
      id: "nhan-ket-qua-tiep-nhan-ho-so",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.8",
      name: "Dịch vụ nhận kết quả tiếp nhận hồ sơ",
      description: "Tra cứu kết quả tiếp nhận hồ sơ giám định theo khoảng thời gian, trả về tổng số hồ sơ gửi lên, số thành công, số lỗi và tổng tiền theo từng ngày.",
      method: "POST",
      endpoint: "http://egw.baohiemxahoi.gov.vn/api/egw/nhanKQTiepNhanHS4210",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Query)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Query)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập, tối đa 5 ký tự (Query)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập, 6–10 ký tự (Query)" },
        { name: "loaiHoSo", type: "Int", required: true, description: "Loại hồ sơ: 3 = KCB, 5 = 79/80a, 6 = Mẫu 19, 7 = Mẫu 20, 8 = Mẫu 21, 9 = Giấy chuyển tuyến (Query)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB gửi hồ sơ theo Quy định 5084 (Query)" },
        { name: "tuNgay", type: "String", required: true, description: "Từ ngày — định dạng DD/MM/YYYY (Query)" },
        { name: "denNgay", type: "String", required: true, description: "Đến ngày — định dạng DD/MM/YYYY (Query)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "dsKQGuiHoSoNgay", message: "Danh sách kết quả gửi hồ sơ theo ngày (mảng object)" },
        { code: "dsKQGuiHoSoNgay[].ngayGui", message: "Ngày gửi hồ sơ" },
        { code: "dsKQGuiHoSoNgay[].tongSo", message: "Tổng số hồ sơ đã gửi lên" },
        { code: "dsKQGuiHoSoNgay[].soHSThanhCong", message: "Số hồ sơ thành công" },
        { code: "dsKQGuiHoSoNgay[].soHSLoi", message: "Số hồ sơ lỗi" },
        { code: "dsKQGuiHoSoNgay[].tongTien", message: "Tổng tiền hồ sơ thành công" },
      ],
      xmlTemplate: "N/A",
    },
    {
      id: "nhan-chi-tiet-ho-so-trong-ngay",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.9",
      name: "Dịch vụ nhận chi tiết hồ sơ trong ngày",
      description: "Lấy chi tiết từng giao dịch hồ sơ đã gửi trong một ngày cụ thể, bao gồm số lượng hồ sơ đúng, lỗi và tổng tiền.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/egw/nhanChiTietHSNgay4210",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Query)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Query)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập, tối đa 5 ký tự (Query)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập, 6–10 ký tự (Query)" },
        { name: "loaiHoSo", type: "Int", required: true, description: "Loại hồ sơ: 3 = KCB, 5 = 79/80a, 6 = Mẫu 19, 7 = Mẫu 20, 8 = Mẫu 21, 9 = Giấy chuyển tuyến (Query)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB gửi hồ sơ theo Quy định 5084 (Query)" },
        { name: "ngayGui", type: "String", required: true, description: "Ngày gửi hồ sơ — định dạng DD/MM/YYYY (Query)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "dsHoSo", message: "Danh sách chi tiết giao dịch trong ngày (mảng object)" },
        { code: "dsHoSo[].ngayGui", message: "Ngày gửi hồ sơ" },
        { code: "dsHoSo[].maGiaoDich", message: "Mã giao dịch — dùng để tra lỗi tại mục 1.10" },
        { code: "dsHoSo[].soLuongHoSo", message: "Số lượng hồ sơ trong giao dịch" },
        { code: "dsHoSo[].slHoSoDung", message: "Số lượng hồ sơ đúng" },
        { code: "dsHoSo[].slHoSoLoi", message: "Số lượng hồ sơ lỗi" },
        { code: "dsHoSo[].tongTien", message: "Tổng tiền" },
        { code: "dsHoSo[].mieuTa", message: "Mô tả thêm về giao dịch" },
      ],
      xmlTemplate: "N/A",
    },
    {
      id: "nhan-chi-tiet-loi-ho-so",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.10",
      name: "Dịch vụ nhận chi tiết lỗi hồ sơ",
      description: "Lấy danh sách mã lỗi và mô tả lỗi của một giao dịch cụ thể. Cần có maGiaoDich lấy từ mục 1.9.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/egw/nhanChiTietLoiHS4210",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Query)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Query)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập, tối đa 5 ký tự (Query)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập, 6–10 ký tự (Query)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB gửi hồ sơ theo Quy định 5084 (Query)" },
        { name: "maGiaoDich", type: "String", required: true, description: "Mã giao dịch nhận được từ mục 1.9 (Query)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "dsLoi", message: "Danh sách lỗi của giao dịch (mảng object)" },
        { code: "dsLoi[].maLoi", message: "Mã lỗi: 201 = XML sai định dạng, 202 = Nội dung XML sai, 204 = XML rỗng, 401 = Lỗi xác thực, 408 = Timeout, 500 = Lỗi server, 10 = Lỗi lấy thông tin thẻ" },
        { code: "dsLoi[].moTaLoi", message: "Mô tả chi tiết nội dung lỗi" },
      ],
      xmlTemplate: "N/A",
    },
    {
      id: "nhan-danh-sach-dot-giam-dinh",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.11",
      name: "Dịch vụ nhận danh sách đợt giám định trong tháng",
      description: "Lấy danh sách các đợt giám định BHYT trong tháng của cơ sở KCB.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/his/KQDanhSachDotGiamDinh",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Header)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Header)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập (Body)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập mã hóa MD5 (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB theo Quy định 5084 (Body)" },
        { name: "thang", type: "String", required: true, description: "Tháng cần tra cứu — định dạng MM (Body)" },
        { name: "nam", type: "String", required: true, description: "Năm cần tra cứu — định dạng YYYY (Body)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "dsDotGiamDinh", message: "Danh sách đợt giám định trong tháng (mảng object)" },
        { code: "dsDotGiamDinh[].maDot", message: "Mã đợt giám định" },
        { code: "dsDotGiamDinh[].tenDot", message: "Tên đợt giám định" },
        { code: "dsDotGiamDinh[].tuNgay", message: "Ngày bắt đầu đợt giám định" },
        { code: "dsDotGiamDinh[].denNgay", message: "Ngày kết thúc đợt giám định" },
        { code: "dsDotGiamDinh[].trangThai", message: "Trạng thái đợt giám định" },
      ],
      xmlTemplate: "{\n  \"username\": \"string\",\n  \"password\": \"string\",\n  \"maCSKCB\": \"string\",\n  \"thang\": \"string\",\n  \"nam\": \"string\"\n}",
    },
    {
      id: "nhan-ket-qua-giam-dinh-ho-so",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.12",
      name: "Dịch vụ nhận kết quả giám định hồ sơ",
      description: "Lấy kết quả giám định chi tiết từng hồ sơ KCB của cơ sở theo đợt giám định.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/his/KQGiamDinhHoSo",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Header)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Header)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập (Body)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập mã hóa MD5 (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB theo Quy định 5084 (Body)" },
        { name: "maDot", type: "String", required: true, description: "Mã đợt giám định lấy từ mục 1.11 (Body)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "dsKetQuaGiamDinh", message: "Danh sách kết quả giám định từng hồ sơ (mảng object)" },
        { code: "dsKetQuaGiamDinh[].maLK", message: "Mã đợt điều trị (liên kết với XML1)" },
        { code: "dsKetQuaGiamDinh[].trangThai", message: "Trạng thái giám định: Đạt / Không đạt / Cần bổ sung" },
        { code: "dsKetQuaGiamDinh[].soTienDuyet", message: "Số tiền BHXH chấp thuận thanh toán" },
        { code: "dsKetQuaGiamDinh[].lyDo", message: "Lý do từ chối hoặc yêu cầu bổ sung (nếu có)" },
      ],
      xmlTemplate: "{\n  \"username\": \"string\",\n  \"password\": \"string\",\n  \"maCSKCB\": \"string\",\n  \"maDot\": \"string\"\n}",
    },
    {
      id: "nhan-quyet-toan-thang-quy",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "1.13",
      name: "Dịch vụ nhận quyết toán tháng/quý",
      description: "Lấy kết quả quyết toán BHYT tháng hoặc quý của cơ sở KCB từ cơ quan BHXH.",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/his/KQQuyetToan",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "token", type: "String", required: true, description: "access_token lấy được từ mục 1.1 (Header)" },
        { name: "id_token", type: "String", required: true, description: "id_token lấy được từ mục 1.1 (Header)" },
        { name: "username", type: "String", required: true, description: "Tài khoản đăng nhập (Body)" },
        { name: "password", type: "String", required: true, description: "Mật khẩu đăng nhập mã hóa MD5 (Body)" },
        { name: "maCSKCB", type: "String", required: true, description: "Mã cơ sở KCB theo Quy định 5084 (Body)" },
        { name: "kyQuyetToan", type: "String", required: true, description: "Kỳ quyết toán — định dạng MM/YYYY (tháng) hoặc QX/YYYY (quý, ví dụ Q1/2024) (Body)" },
      ],
      responseParams: [
        { code: "maKetQua", message: "Mã kết quả giao dịch (Thành công, lỗi)" },
        { code: "kyQuyetToan", message: "Kỳ quyết toán" },
        { code: "tongChiPhiDeNghi", message: "Tổng chi phí cơ sở KCB đề nghị thanh toán" },
        { code: "tongChiPhiDuyet", message: "Tổng chi phí BHXH chấp thuận" },
        { code: "tongChiPhiKhongDuyet", message: "Tổng chi phí không được duyệt" },
        { code: "lyDoKhongDuyet", message: "Lý do không duyệt (nếu có)" },
        { code: "trangThai", message: "Trạng thái quyết toán: Đã duyệt / Chờ duyệt / Từ chối" },
      ],
      xmlTemplate: "{\n  \"username\": \"string\",\n  \"password\": \"string\",\n  \"maCSKCB\": \"string\",\n  \"kyQuyetToan\": \"string\"\n}",
    },
    {
      id: "tra-luu-giay-kham-suc-khoe",
      serviceGroupId: "bhyt-web-service",
      sectionNumber: "5",
      name: "API tra lưu giấy khám sức khỏe",
      description: "Để phần mềm HIS triển khai tại cơ sở y tế gửi dữ liệu khám sức khỏe lên Cổng tiếp nhận dữ liệu Hệ thống thông tin giám định BHYT",
      method: "POST",
      endpoint: "https://egw.baohiemxahoi.gov.vn/api/hssk/gksk",
      requestParams: [
        { name: "Content-Type", type: "String", required: true, description: "application/json (Header)" },
        { name: "Username", type: "String", required: true, description: "Username đăng nhập hệ thống được cổng dữ liệu y tế cung cấp (Header)" },
        { name: "Password", type: "String", required: true, description: "password của user được hệ thống cổng dữ liệu y tế cung cấp (Được mã hóa MD5) (Header)" },
        { name: "SO", type: "String", required: true, description: "Số giấy khám: Đặt theo quy tắc 5 Số thứ tự khám tự tăng /GKSKLX/ Mã CSKCB/ Năm (XX) (Body)" },
        { name: "HOTEN", type: "String", required: true, description: "Họ tên người khám (Body)" },
        { name: "GIOITINHVAL", type: "String", required: true, description: "Giới tính (0: Nam, 1: Nữ) (Body)" },
        { name: "NGAYSINH", type: "String", required: true, description: "Ngày sinh (dd/MM/yyyy) (Body)" },
        { name: "DIACHITHUONGTRU", type: "String", required: true, description: "Địa chỉ thường trú (Body)" },
        { name: "MATINH_THUONGTRU", type: "String", required: true, description: "Mã tỉnh thường trú (Body)" },
        { name: "MAHUYEN_THUONGTRU", type: "String", required: true, description: "Mã huyện thường trú (Body)" },
        { name: "MAXA_THUONGTRU", type: "String", required: true, description: "Mã xã thường trú (Body)" },
        { name: "SOCMND_PASSPORT", type: "String", required: true, description: "Số CMND/CCCD/Hộ chiếu (Body)" },
        { name: "NGAYTHANGNAMCAPCMND", type: "String", required: true, description: "Ngày tháng năm cấp (dd/MM/yyyy) (Body)" },
        { name: "NOICAP", type: "String", required: true, description: "Nơi cấp (Body)" },
        { name: "IDBENHVIEN", type: "String", required: true, description: "Mã CSYT theo mã bảo hiểm (Body)" },
        { name: "BENHVIEN", type: "String", required: true, description: "Tên Bệnh viện (Body)" },
        { name: "NONGDOCON", type: "String", required: true, description: "Kết quả nồng độ cồn của người đi khám (Body)" },
        { name: "DVINONGDOCON", type: "String", required: true, description: "Đơn vị nồng độ cồn: 0:miligam/100ml máu, 1:miligam/1 lít khí thở (Body)" },
        { name: "MATUY", type: "String", required: true, description: "Kết quả xét nghiệm ma túy: 0:Âm tính, 1:Dương tính (Body)" },
        { name: "NGAYKETLUAN", type: "String", required: true, description: "Ngày khám (dd/MM/yyyy) (Body)" },
        { name: "BACSYKETLUAN", type: "String", required: true, description: "Tên Bác sỹ kết luận (Body)" },
        { name: "KETLUAN", type: "String", required: true, description: "Kết luận của Bác sĩ (A0-1, A0-2, A0-3) (Body)" },
        { name: "HANGBANGLAI", type: "String", required: true, description: "Hạng bằng lái (Body)" },
        { name: "NGAYKHAMLAI", type: "String", required: false, description: "Ngày khám lại nếu có yêu cầu (dd/MM/yyyy) (Body)" },
        { name: "LYDO", type: "String", required: false, description: "Lý do sức khỏe không đạt (Body)" },
        { name: "TINHTRANGBENH", type: "String", required: false, description: "Tình trạng bệnh tật hiện tại (Body)" },
        { name: "STATE", type: "String", required: true, description: "Trạng thái giấy khám sức khỏe (EDIT/ADD) (Body)" },
        { name: "SIGNDATA", type: "String", required: true, description: "Dữ liệu Hash thông tin ký số của file XML (Base64) (Body)" }
      ],
      responseParams: [
        { code: "MSG_STATE", message: "Trạng thái (1: Thành công, 0: Không thành công)" },
        { code: "MSG_TEXT", message: "Thông báo kết quả" },
        { code: "IDBENHVIEN", message: "Mã bệnh viện" },
        { code: "SO", message: "Số giấy khám" },
        { code: "UUID", message: "UUID" },
        { code: "BENHVIEN", message: "Tên bệnh viện" }
      ],
      xmlTemplate: `{\n "SO": "00001/GKSKLX/34001/20",\n "HOTEN": "Nguyễn Văn An",\n "GIOITINHVAL": "1",\n "NGAYSINH": "21/05/1990",\n "DIACHITHUONGTRU": "Phường Giảng Võ-Quận Ba Đình-TP Hà Nội",\n "MATINH_THUONGTRU": "93",\n "MAHUYEN_THUONGTRU": "93931",\n "MAXA_THUONGTRU": "9393131344",\n "SOCMND_PASSPORT": "12430987897",\n "NGAYTHANGNAMCAPCMND": "01/02/2020",\n "NOICAP": "Hà Nội",\n "IDBENHVIEN": "01924",\n "BENHVIEN": "Bênh viện nhiệt đới TW",\n "NONGDOCON": "30",\n "DVINONGDOCON": "0",\n "MATUY": "1",\n "NGAYKETLUAN": "06/02/2020",\n "BACSYKETLUAN": "Phạm Hồng Vân",\n "KETLUAN": "A1-0",\n "HANGBANGLAI": "A1",\n "NGAYKHAMLAI": "01/02/2020",\n "LYDO": "Lý do sức khỏe không đạt",\n "TINHTRANGBENH": "tình trạng bệnh tật hiện tại",\n "STATE": "EDIT",\n "SIGNDATA": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48..."\n}`
    }
  ]
};
