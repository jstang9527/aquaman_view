import request from '@/utils/request'

export function DetectList(query) { //检出列表
    return request({
        url: '/pocvul/detect',
        method: 'get',
        params: query
    })
}

export function TaskList(query) { //任务列表
    return request({
        url: '/pocvul/tasks',
        method: 'get',
        params: query
    })
}

export function TaskDetail(query) { //任务详情
    return request({
        url: '/pocvul/task',
        method: 'get',
        params: query
    })
}

export function CreateTask(data) { //创建任务
    return request({
        url: '/pocvul/task',
        method: 'post',
        data
    })
}

export function PutTask(data) { //更新任务
    return request({
        url: '/pocvul/task',
        method: 'put',
        data
    })
}

export function DelTask(query) { //删除任务
    return request({
        url: '/pocvul/task',
        method: 'delete',
        params: query
    })
}

export function TaskRescan(query) { //立即重扫
    return request({
        url: '/pocvul/task',
        method: 'patch',
        params: query
    })
}

export function PluginList(query) { //插件列表
    return request({
        url: '/pocvul/plugin',
        method: 'get',
        params: query
    })
}

export function AddPlugin(data) { //添加插件
    return request({
        url: '/pocvul/plugin',
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data
    })
}

export function DelPlugin(query) { //删除插件
    return request({
        url: '/pocvul/plugin',
        method: 'delete',
        params: query
    })
}