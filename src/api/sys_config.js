import request from '@/utils/request'

export function GetConfig() { //获取系统配置信息
    return request({
        url: '/sys/config',
        method: 'get',
    })
}

export function PutConfig(data) { //获取系统配置信息
    return request({
        url: '/sys/config',
        method: 'put',
        data
    })
}