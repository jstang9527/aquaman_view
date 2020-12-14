import request from '@/utils/request'

export function taskList(query) { //任务列表
    return request({
        url: '/mars/task_list',
        method: 'get',
        params: query
    })
}

export function AddTask(data) { //添加任务
    return request({
        url: '/mars/task',
        method: 'post',
        data
    })
}

export function UpdateTask(data) { //更新任务
    return request({
        url: '/mars/task',
        method: 'put',
        data
    })
}

export function TaskDetail(query) { //任务详情
    return request({
        url: '/mars/task_detail',
        method: 'get',
        params: query
    })
}

export function TaskReport(query) { //检测结果
    return request({
        url: '/mars/task/report',
        method: 'get',
        params: query
    })
}