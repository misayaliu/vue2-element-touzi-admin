import request from '@/utils/plataxios'

export function getHiveTbList(params) {
  return request({

    url: '/tdw/tbList',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function getUsTemplateList(params) {
  return request({

    url: '/template/list',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

//批量创提交
export function templateAddTask(params) {
  return request({

    url: '/template/templateAddTask',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}


export function editTemplate(params) {
  return request({

    url: '/template/editTemplate',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function templateEditInfo(params) {
  return request({

    url: '/template/templateEditInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}


export function getUsTaskTypeList(params) {
  return request({

    url: '/template/taskTypeList',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function getBaseProp(params) {
  return request({

    url: '/template/taskBaseProp',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function getTaskPropDetail(params) {
  return request({

    url: '/template/taskPropDetail',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function addTemplate(params) {
  return request({

    url: '/template/addTemplate',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function getEventList(params) {
  return request({

    url: '/event/list',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}


export function getOrderStrInfo(params) {
  return request({

    url: '/orders/getOrderStrInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}


export function getPartOrderStrInfo(params) {
  return request({

    url: '/orders/getPartOrderStrInfo',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function batchStockOut(params) {
  return request({

    url: '/assign/batchStockOut',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function markBlock(params) {
  return request({

    url: '/assign/markBlock',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}
export function doOrderTask(params) {
  return request({

    url: '/orders/doOrderTask',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}


export function syncShopList() {
  return request({
    url: '/shop/allList',
    method: 'get',
    contentType: 'application/json'
  })
}


export function getStaffList(params) {
  return request({
    url: '/staff/list',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}

export function getOrderList(params) {
  return request({
    url: '/orders/list',
    method: 'post',
    contentType: 'application/json',
    data: params
  })
}


export function orderSign(params) {
  return request({

    url: '/assign/saveOrUpdate',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}
export function getLineage(params) {
  return request({

    url: '/us/getLineage',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}

export function getHierarchyList(params) {
  return request({

    url: '/tdw/getHierarchyList',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}



export function updateTbInfo(params) {
  return request({

    url: '/tdw/updateTbInfo',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}

export function updateColInfo(params) {
  return request({

    url: '/tdw/updateColInfo',
    method: 'post',
    contentType: 'application/json' ,
    data: params
  })
}