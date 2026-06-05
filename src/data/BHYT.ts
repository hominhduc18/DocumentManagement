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
      xmlTemplate: `username=79560_BV&password=72C974F09D6ACA02DE639132F6275F83`
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
      xmlTemplate: `{\n  "maThe": "7912058865",\n  "hoTen": "Đặng Văn Nhựt",\n  "ngaySinh": "10/11/1988",\n  "hoTenCb": "phạm thị thơm",\n  "cccdCb": "030186002959"\n}`
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
    }
  ]
};
