import request from '@/utils/request'

export function chainAddBlock(data) { //添加组件
    return request({
        url: '/chain/block',
        method: 'post',
        data
    })
}

export function chainUpdateBlock(data) { //添加组件
    return request({
        url: '/chain/block',
        method: 'put',
        data
    })
}

export function chainAddStream(data) { //添加流水线
    return request({
        url: '/chain/stream',
        method: 'post',
        data
    })
}

export function blockList(query) { //组件列表,一个组件有多个动作
    return request({
        url: '/chain/block_list',
        method: 'get',
        params: query
    })
}

export function StreamList(query) { //流水线列表,一个流水线有多个组件
    return request({
        url: '/chain/stream_list',
        method: 'get',
        params: query
    })
}

export function blockDetail(query) { //组件详情,一个组件有多个动作
    return request({
        url: '/chain/block',
        method: 'get',
        params: query
    })
}