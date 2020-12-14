import request from '@/utils/request'

export function serviceList(query) {
    return request({
        url: '/service/service_list',
        method: 'get',
        params: query
    })
}

export function serviceDelete(query) {
    return request({
        url: '/service/service',
        method: 'delete',
        params: query
    })
}

export function serviceDetail(query) {
    return request({
        url: 'service/service',
        method: 'get',
        params: query
    })
}

export function serviceAddHTTP(data) {
    return request({
        url: '/service/service/http',
        method: 'post',
        data
    })
}

