import request from '@/utils/request'

export function InfoDetail(query) { //资产详情
    return request({
        url: '/instance/info',
        method: 'get',
        params: query
    })
}

export function AddAsset(data) { //创建资产
    return request({
        url: '/instance/info',
        method: 'post',
        data
    })
}

export function InfoList(query) { //资产信息列表
    return request({
        url: '/instance/list',
        method: 'get',
        params: query
    })
}

export function DelInstance(query) { //删除实例及端口信息
    return request({
        url: '/instance/info',
        method: 'delete',
        params: query
    })
}

export function PortInfoList(query){//端口信息列表
    return request({
        url: '/instance/service/list',
        method: 'get',
        params: query
    })
}

export function PortInfoDetail(query) { //单个端口漏洞详情
    return request({
        url: '/service/info',
        method: 'get',
        params: query
    })
}

export function RescanInstance(query) { //立即重扫
    return request({
        url: '/instance/info',
        method: 'patch',
        params: query
    })
}

export function DiscoveryList(query) { //探测任务列表
    return request({
        url: '/instance/discovery/list',
        method: 'get',
        params: query
    })
}

export function DiscoveryInfo(query) { //单个探测任务详情
    return request({
        url: '/instance/discovery',
        method: 'get',
        params: query
    })
}

export function AddDiscovery(data) { //创建
    return request({
        url: '/instance/discovery',
        method: 'post',
        data
    })
}

export function PutDiscovery(data) { //更新
    return request({
        url: '/instance/discovery',
        method: 'put',
        data
    })
}

export function DelDiscovery(query) { //删除
    return request({
        url: '/instance/discovery',
        method: 'delete',
        params: query
    })
}

export function ExeDiscovery(query) { //立即重扫
    return request({
        url: '/instance/discovery',
        method: 'patch',
        params: query
    })
}