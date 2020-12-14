import request from '@/utils/request'

export function domainList(query) {
    return request({
        url: '/host/host_list',
        method: 'get',
        params: query
    })
}


export function domainDelete(query) {
    return request({
        url: '/host/domain',
        method: 'delete',
        params: query
    })
}
export function domainAdd(data) {
    return request({
        url: '/host/domain',
        method: 'post',
        data
    })
}
export function domainEdit(data) {
    return request({
        url: '/host/domain',
        method: 'post',
        data
    })
}


// -- 控制方法
// + 域状态
export function domainStatus(query) {
    return request({
        url: '/host/control/status',
        method: 'get',
        params: query
    })
}
// + 关闭域
export function domainDown(query) {
    return request({
        url: '/host/control/shutdown',
        method: 'put',
        params: query
    })
}
// + 开启域
export function domainStart(query) {
    return request({
        url: '/host/control/start',
        method: 'put',
        params: query
    })
}
// + 恢复域(必须开启的状态下执行,可修改后端进行更改策略)
export function domainRecover(query) {
    return request({
        url: '/host/control/recover',
        method: 'put',
        params: query
    })
}