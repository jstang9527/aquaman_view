import request from '@/utils/request'


export function DetectList(query) { //检出列表
    return request({
        url: '/auth_tester/detect',
        method: 'get',
        params: query
    })
}

export function TaskList(query) { //任务列表
    return request({
        url: '/auth_tester/tasks',
        method: 'get',
        params: query
    })
}

export function ConfigData() { //获取认证检测配置信息
    return request({
        url: '/auth_tester/config',
        method: 'get',
    })
}

export function AddTask(data) { //创建任务
    return request({
        url: '/auth_tester/task',
        method: 'post',
        data
    })
}

export function TaskDetail(query) { //任务详情
    return request({
        url: '/auth_tester/task',
        method: 'get',
        params: query
    })
}

export function DelTask(query) { //删除任务
    return request({
        url: '/auth_tester/task',
        method: 'delete',
        params: query
    })
}

export function RescanTask(query) { //重扫任务
    return request({
        url: '/auth_tester/task',
        method: 'patch',
        params: query
    })
}

export function PutTask(data) { //更新任务
    return request({
        url: '/auth_tester/task',
        method: 'put',
        data
    })
}

export function DeleteDetect(query) { //删除检测记录
    return request({
        url: '/auth_tester/detect',
        method: 'delete',
        params: query
    })
}