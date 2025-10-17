// Utility helpers
const titleMap = {
  dashboard: 'Dashboard',add:'Thêm nhân viên',edit:'Sửa nhân viên',delete:'Xóa nhân viên',search:'Tìm kiếm',departments:'Phòng ban',positions:'Vị trí',salary:'Lương',attendance:'Chấm công',leave:'Nghỉ phép',performance:'Hiệu suất'
};

export default {
  titleForRoute: (r)=> titleMap[r] || 'HRM',
  genId: (prefix='id')=> `${prefix}_${Math.random().toString(36).slice(2,9)}`,
  delay: (ms=300)=> new Promise(res=>setTimeout(res,ms)),
  formatDate: (d)=> new Date(d).toLocaleDateString()
};
