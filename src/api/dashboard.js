import request from '@/utils/request'

export function DashboardData() { //获取认证检测配置信息
    return request({
        url: '/dashboard',
        method: 'get',
    })
}
