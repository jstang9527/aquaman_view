import request from '@/utils/request'


export function InfoList(query) { //资产信息列表
    return request({
        url: '/asset/list',
        method: 'get',
        params: query
    })
}

export function InfoDetail(query) { //资产信息详情
    return request({
        url: '/asset/info',
        method: 'get',
        params: query
    })
}

export function DelInfo(query) { //删除资产信息
    return request({
        url: '/asset/info',
        method: 'delete',
        params: query
    })
}