const axios = require('axios');
const EventEmitter = require('events');

class ApiConfig extends EventEmitter {
  constructor() {
    super()
    this.axiosConfig = {
      // baseURL: 'https://api-qidatestin.yunxuetang.cn/v1/',
      baseURL: 'https://api-qida1.yunxuetang.cn/v1/',
      transformRequest: [data => JSON.stringify(data)],
      transformResponse: [data => {
        try {
          return JSON.parse(data)
        }
        catch (err) {
          return data
        }
      }],
      headers: {'source': 501, 'Content-type': 'application/json;charset=UTF-8'},
      params: {r: Math.random()}
    }
  }
  
}

class User extends ApiConfig {
  constructor(name, password, domain) {
    super()
    this.userName = name
    this.password = password
    this.orgId = ''
    this.userId = ''
    if (domain) {
      this.getTokenByDomain()
    } else {
      this.getTokenByGlobal()
    }
  }

  getTokenByGlobal () {
    let url = '/global/users/tokens' // 没有输入域名的token
    let data = {
      deviceId: '',
      isCheck: 1,
      nb: 1,
      password: (new Buffer(this.password)).toString('base64'),
      userName: (new Buffer(this.userName)).toString('base64')
    }
    axios.post(url, data, this.axiosConfig)
      .then(res => {
        this.axiosConfig.headers['token'] = res.data.token
        this.orgId = res.data.orgId
        this.userId = res.data.userId
        this.emit('tokenDone') // 获取token完成
      })
      .catch(err => {
        console.log(err.response.data.error)
      })
  }
  // todo: 需要输入域名的接口
  getTokenByDomain () {
    let url = 'users/tokens'
    let data = {
      deviceId: '',
      isCheck: 1,
      nb: 1,
      password: (new Buffer(this.password)).toString('base64'),
      userName: (new Buffer(this.userName)).toString('base64'),
      domainName: this.domainName
    }
    axios.post(url, data, this.axiosConfig)
      .then(res => {
        this.axiosConfig.headers['token'] = res.data.token
        this.orgId = res.data.orgId
        this.userId = res.data.userId
        this.emit('tokenDone') // 获取token完成
      })
      .catch(err => {
        console.log(err)
      })
  }
}

class Plan extends EventEmitter {
  constructor(user) {
    super()
    this.user = user
    this.list = []
    this.kngList = []
    this.notCompleteKngList = null
    this.planDetail = null // 计划数据
    // 计划未完成列表
    this.getPlanList(1)
  }

  /**
   * 获取计划列表
   * @param {string} type 1: 进行中 2: 已完成
   */
  getPlanList (type) {
    let url = `studyplan/mylist?orgId=${this.user.orgId}&status=${type}`
    axios.get(url, this.user.axiosConfig)
      .then(res => {
        this.list = this.list.concat(res.data.datas)
        this.emit('planListDone')
      })
  }

  // 获取计划下的知识
  getKngList (id) {
    let url = `studyplan/myplan/${id}`
    axios.get(url, this.user.axiosConfig)
      .then(res => {
        this.kngList = res.data.details
        this.planDetail = res.data.plan
        this.getNotCompleteKngList()
        // this.getNotCompleteKng()
        // this.getNextStudy()
        this.emit('kngListDone')
      })
  }

  getNotCompleteKngList () {
    this.notCompleteKngList = this.kngList.filter(v => {
      return v.studySchedule !== '100'
    })
  }

  getNotCompleteKng () {
    this.notCompleteKng = this.notCompleteKngList.shift()
    // this.notCompleteKng = this.notCompleteKngList[1]
  }

  getNextStudy (PushStudy) {
    this.getNotCompleteKng()
    if (this.notCompleteKng) {
      // 计划中单个知识
      console.log(this.notCompleteKng['knowledgeTitle'])
      const study = new PushStudy(this.user, this.notCompleteKng, this.planDetail.parentPlanId)
      study.on('pushStudyQueueStudyDone', () => {
        study.removeAllListeners('pushStudyQueueStudyDone')
        this.getNextStudy(PushStudy)
      })
    }
  }
}

class PushStudy extends EventEmitter {
  constructor(user, kng, parentPlanId) {
    // console.log(kng.knowledgeSourceId, '----', parentPlanId)
    super()
    this.kng = kng
    this.user = user
    this.kngList = [] // 课程包的知识列表
    this.notCompleteKngList = [] // 学习进度未完成的
    this.notCompleteKng = null // 未完成的知识
    this.study = {
      'OrgID': user.orgId,
      'UserID': user.userId,
      'KnowledgeID': '',
      'MasterID': parentPlanId, // 计划id
      'MasterType': 'Plan',
      'PackageID': kng.knowledgeSourceId, // 课程包id
      'StudyTime': '120',
      'Type': '1'
    }
    this.push() // 提交学习进度
  }

  push () {
    if (this.kng.fileType === 'CoursePackage') {
      // todo: 课程包文件的处理
      if (this.kng.studySchedule === '100') {
        // console.log(this.kng.knowledgeTitle, '\n')
      } else {
        this.getKngDetailFromCourse()
      }
    } else {
      // todo: 正常文件处理
      this.study['KnowledgeID'] = this.kng.id
    }
  }

  getKngDetailFromCourse () {
    // 获取课程包的知识
    let url = `subknowledges/${this.kng.knowledgeSourceId}?masterId=${this.kng.userKnowledgeId}`
    axios.get(url, this.user.axiosConfig)
      .then(res => {
        this.kngList = res.data.datas
        this.setNotCompleteKngList()
        this.getNextKng()
        this.queueStudy()
      })
  }
  
  setNotCompleteKngList () {
    this.notCompleteKngList = this.kngList.filter(v => {
      return v.studySchedule !== 100
    })
  }

  getNextKng () {
    this.notCompleteKng = this.notCompleteKngList.shift() // 获取未完成的知识
  }

  queueStudy () {
    if (this.notCompleteKng.standardStudyHours < 2 && this.notCompleteKng.studySchedule >= 100) {
      this.process(() => {
        this.queueStudy()
      })
    } else if (this.notCompleteKng.standardStudyHours - (this.notCompleteKng.studySchedule / 100) * this.notCompleteKng.standardStudyHours >= 2) {
      setTimeout(() => {
        this.process(() => {
          this.queueStudy()
        })
      }, 2 * 60 * 1000)
    } else {
      this.getNextKng()
      if (this.notCompleteKng) {
        this.queueStudy()
      } else {
        console.log('知识完成')
        this.emit('pushStudyQueueStudyDone') // 计划详情中一个知识学完
      }
    }
  }

  process (cb = () => {}) {
    this.study.KnowledgeID = this.notCompleteKng.id
    axios.post('study', this.study, this.user.axiosConfig)
      .then(res => {
        // console.log(this.study)
        // console.log(res.data)
        // pc验防作弊，只能存在一个学习知识，所以别的知识进度无法更新，返回学习那个知识名
        this.notCompleteKng.studySchedule += 200 / this.notCompleteKng.standardStudyHours
        console.log('Success -- ', this.notCompleteKng.title, ' -- ', this.notCompleteKng.studySchedule.toFixed(2) + '%')
        cb()
      })
      .catch(err => {
        console.log(err)
      })
  }
}

const user = new User('admin', '111111')
user.on('tokenDone', () => {
  console.log(user)
})
// user.on('tokenDone', () => {
//   user.removeAllListeners('tokenDone')

//   // 获取计划
//   const plan = new Plan(user)

//   plan.on('planListDone', () => {
//     plan.removeAllListeners('planListDone')
//     // 获取第二个计划知识列表
//     plan.getKngList(plan.list[0]['id'])
//     plan.on('kngListDone', () => {
//       plan.removeAllListeners('kngListDone')
//       plan.getNextStudy(PushStudy)
//     })
//   })
// })