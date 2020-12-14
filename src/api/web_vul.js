import request from '@/utils/request'

export function DetectList(query) { //检出列表
    return request({
        url: '/webvul/detect/list',
        method: 'get',
        params: query
    })
}

export function DetectInfo(query) { //检出详情
    return request({
        url: '/webvul/detect',
        method: 'get',
        params: query
    })
}

export function DownloadReport(query) { //导出报告
    return request({
        url: '/webvul/detect',
        method: 'patch',
        params: query
    })
}

export function TaskList(query) { //任务列表
    return request({
        url: '/webvul/tasks',
        method: 'get',
        params: query
    })
}

export function AddTask(data) { //创建任务
    return request({
        url: '/webvul/task',
        method: 'post',
        data
    })
}

export function DelTask(query) { //删除任务
    return request({
        url: '/webvul/task',
        method: 'delete',
        params: query
    })
}