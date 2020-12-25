---
title: 篮球技术统计接口说明
sidebarDepth: 4
---

## 1 规范说明

### 1.1 请求方法

所有接口只支持 POST 请求

### 1.2 公共请求头部

所有技术统计的 API，`header`中都要加上以下公共头部，各头部说明如下：

| 名称          | 说明                                                                                                  | 类型   | 长度 | 是否必须 |
| ------------- | ----------------------------------------------------------------------------------------------------- | ------ | ---- | -------- |
| seq-no        | 请求流水号,(不超过 16 位 最好使用 带毫秒的时间戳)                                                     | String | <=16 | 是       |
| source        | 见 [1.5.2.3 `source`](#1523-source)详细说明                                                           | String | 32   | 是       |
| time-stamp    | 操作时间，格式：1430275304,服务器当前时间+-180 秒范围内                                               | String | 11   | 是       |
| user-id       | 用户 ID 。注:用户登录后此参数为必填                                                                   | String | 11   | 否       |
| access-token  | 登录通行证，登录操作后返回此参数，每次注销操作或重新登录操作此参数值会变更。注:用户登录后此参数为必填 | String | 32   | 否       |
| terminal-type | 设备类型，值为 Android\IOS\Web 或 Windows                                                             | string | <10  | 是       |

### 1.3 请求报文

请求的数据大部分位于`body`中，少部分位于`header`。

如比赛的 ID `MatchCode` ，动作的 ID `action-no` 等。

在`body`中的数据格式如无特殊说明统一采用 `JSON` 格式。

#### 1.3.1 请求示例

_请求 API：/teaminfo_

```JSON
// 头部
"access-token": "2d202a899dbead32a1528872e387ef37"
"Content-Type": "application/json"
"match-code": "1005015"
"seq-no": "6372987963022210000"
"source": "0782dc705bb85363418a7884d49171db"
"terminal-type": "Web"
"time-stamp": "1594282830"
"user-id": "21535"
```

```JS
// body
// 空
```

### 1.4 公共返回头

在 header 中，有两个报文标识请求结果：

1. result，0 为成功
2. message，调用成功时无内容，调用失败时返回错误信息

如果 API 有返回值，返回的内容在`body`中，如无特殊说明，统一采用`JSON`格式

#### 1.4.1 系统错误码

错误码为`header`的`result`，具体见下表
|名称|说明|原因|
|---|---|---|
|9999| 缺少参数 seq-no ||
|9998 |缺少参数 terminal-sn ||
|9997| 缺少参数 time-stamp ||
|9996| 非法请求 time-stamp |参数与当前系统服务器时间偏差太大 |
|9995| 缺少参数 terminal-type ||
|9994 |terminal-type 参数异常 |值只能为 Android\IOS\Web 或 Windows|
|9961 |缺少参数 terminal-name | |
|9962| 缺少参数 terminal-net | |
|9963 |缺少参数 terminal-os | |
|9964 |缺少参数 terminal-size | |
|9980| 缺少参数 source | |
|9989 |无访问权限 |source 与加密计算结果不匹配 |
|9598| 缺少参数 access-token| 请求参数中包含 user-id 则必须同时包含 access-token|
|9586 |非法请求 |user-id 不正确 |
|9589| 非法请求 |access-token 与数据库记录不匹配
|4000 |没有数据 ||

#### 1.4.2 示例

请求 API：`/api/matchstatistics/teaminfo`

```JSON
// 头部
"Content-Type": "application/json"
"message": "请求成功"
"result": "0"
"seq-no": "6372987963030210000"
```

```JS
// body
{
  "Message":{
    Date:"20200709",
    Time:"162031",
    TeamList:[/* ... */]
  }
}
```

### 1.5 请求验证

#### 1.5.1 用户信息

在头部中，传入以下参数，用于辨别 API 访问身份：

- access-token：登录后获取的通行证
- user-id：用户 id

#### 1.5.2 来源验证

在头部中，传入以下参数，用于验证访问是否有效。

##### 1.5.2.1 `seq-no`

访问流水号，不超过 16 位，建议使用带毫秒的时间戳

##### 1.5.2.2 `time-stamp`

时间戳，从当前时间到 1970-01-01 秒数

##### 1.5.2.3 `source`

时间戳、流水号、apiKey 经过 md5 运算得到的。
先将 apiKey 与流水号拼接字符串用 md5 加密得到结果 A，再将 A 与时间戳`time-stamp`拼接，拼接结果用 md5 运算得到 source 。
如

```js
const apiKey = "...";
const sql_no = "...";

const tmpsource = md5(apiKey + sql_no);
const source = md5(tmpsource + time_stamp);
```

#### 1.5.3 JS 代码示例。

```js
const apiKey = "hP7Oqb44a7XBcrIR";
const now = new Date().getTime();
const sql_no = parseInt(now - new Date("0001-01-01").getTime());
const time_stamp = parseInt(now / 1000);

const tmpsource = md5(apiKey + sql_no);
const source = md5(tmpsource + time_stamp);
const baseHeader = {
  "seq-no": sql_no,
  "source": source,
  "time-stamp": time_stamp,
  "terminal-type": "Web",
  "access-token": '' // 登录获取的 access_token,
  "user-id": '' // 登录获取的 access_token,
};

const header = Object.assign(baseHeader, otherHeader)
```

## 2 接口定义

### 2.1 获取技术统计员信息

- 接口说明：使用 `code` 获取技术统计员的信息，包括[1.5 请求验证](##15-请求验证)所需的`user-id`和`access-token`
- 接口地址：`/api/matchstatistics/login`

#### 2.1.1 请求参数

| 参数名称                            | 类型   | 是否必须 | 描述                                |
| ----------------------------------- | ------ | :------: | ----------------------------------- |
| **\*header**                        |        |          | 头部                                |
| _[公共请求头部](##12-公共请求头部)_ |        |    是    | 其中 user-id 和 access-token 非必须 |
| usercode                            | String |    是    | 登录所需的 code                     |
|                                     |        |          |                                     |
| **\*body**                          |        |          | body                                |
| 无                                  |        |          |                                     |

#### 2.1.2 返回 `Body`

示例

```JSON
{
    "user_id": 22830,
    "account": "werasdfaeww",
    "access_token": "30e516c8a6b4f249307085b7aba63209",
    "web_access_token": "",
    "authentication": 0,
    "basketball_id": 0,
    "institutional_identity": 0,
    "phone": "",
    "email": "",
    "nationality": "",
    "noc": "",
    "user_name": "",
    "user_en_name": "",
    "sex": 0,
    "id_number": "",
    "birthday": "",
    "birth_province": "",
    "birth_city": "",
    // more info
}
```

::: TIP
`user_id` 和 `access_token`，后续 API 都需要使用，详情见[公共请求头部](##12-公共请求头部)
其他内容为用户信息，按需使用
:::

#### 2.1.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头

### 2.2 获取比赛列表

- 接口说明：获取该技术统计员可统计的所有比赛
- 接口地址：`/api/matchstatistics/matchlist`

#### 2.2.1 请求参数

| 参数名称                            | 类型 | 是否必须 | 描述 |
| ----------------------------------- | ---- | :------: | ---- |
| **\*header**                        |      |          | 头部 |
| _[公共请求头部](##12-公共请求头部)_ |      |    是    |      |
|                                     |      |          |      |
| **\*body**                          |      |          | body |
| 无                                  |      |          |      |

#### 2.2.2 返回 `Body`

##### 2.2.2.1 返回内容说明

返回的是 Match 列表，以下为单个 Match 包含的内容

| 参数名称      | 类型   | 描述                                                               |
| ------------- | ------ | ------------------------------------------------------------------ |
| MatchCode     | String | 比赛标识，后续与比赛相关的 API，头部均需传此值                     |
| CurrentPeriod | String | 当前小节                                                           |
| PeriodStatus  | String | 小节状态（1 未开始，2 开始，3 结束）                               |
| MatchStatus   | String | 当前比赛状态（0 未开始，1 开始，2 中断，3 非官方，4 官方，5 修改） |
| Venue         | String | 场馆                                                               |
| Court         | String | 场地                                                               |
| Phase         | String | 阶段                                                               |
| Rule          | String | 比赛规则                                                           |
| RefereeList   | String | 裁判列表                                                           |

##### 2.2.2.2 返回示例

示例：

```JSON
{
    "Message": {
        "Date": "20200710",
        "Time": "173437",
        "MatchList": [
            {
                "MatchCode": "1004235",
                "MatchName": "第7场",
                "HomeLongName": "社区队",
                "HomeShortName": "社区队",
                "VisitLongName": "直播队",
                "VisitShortName": "直播队",
                "MatchDate": "19700101",
                "StartTime": "08:00",
                "Venue": "",
                "Court": "",
                "MatchStatus": "1",
                "CurrentPeriod": "5",
                "PeriodStatus": "2",
                "Event": "U16女子组",
                "Gender": "2",
                "Phase": "组A",
                "IsEnablePush": 0,
                "Rule": {
                    "Periods": "",
                    "PeriodTime": "",
                    "ExtraPeriodTime": "",
                    "MinPlayersForTeam": "",
                    "MaxPlayersForTeam": "",
                    "MaxFoulsForPlayer": "",
                    "MaxFoulsForTeamPerPeriod": "",
                    "MaxTimeoutsFirstHalf": "",
                    "MaxLongTimeoutsFirstHalf": "",
                    "MaxShortTimeoutsFirstHalf": "",
                    "MaxTimeoutsSecondHalf": "",
                    "MaxLongTimeoutsSecondHalf": "",
                    "MaxShortTimeoutsSecondHalf": "",
                    "MaxTimeoutsOT": "",
                    "MaxLongTimeoutsOT": "",
                    "MaxShortTimeoutsOT": ""
                },
                "RefereeList": [
                    {
                        "RegisterCode": "21424",
                        "Name": "测试技术统计员95",
                        "RefereeType": "6",
                        "CountryOrRegion": "中国",
                        "NOC": "CHN"
                    }
                ]
            },
            // more match
        ]
    }
}
```

#### 2.2.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头

### 2.3 获取动作列表

- 接口说明：获取某场比赛所有的动作列表
- 接口地址：`/api/matchstatistics/actionlist`

#### 2.3.1 请求参数

| 参数名称                            | 类型   | 是否必须 | 描述          |
| ----------------------------------- | ------ | :------: | ------------- |
| **\*header**                        |        |          | 头部          |
| _[公共请求头部](##12-公共请求头部)_ |        |    是    |               |
| match-code                          | String |    是    | 某场比赛的 ID |
|                                     |        |          |               |
| **\*body**                          |        |          | body          |
| 无                                  |        |          |               |

#### 2.3.2 返回 `Body`

##### 2.3.2.1 返回内容说明

返回的是 Action 列表，以下为单个 Action 包含的内容

| 参数名称                | 类型        | 描述                                 |
| ----------------------- | ----------- | ------------------------------------ |
| HomeScore               | Number      | 主队比分                             |
| VisitScore              | Number      | 客队比分                             |
| Period                  | Number      | 该动作发生的阶段                     |
| ActionCode              | String      | 动作类型（详情参考动作类型文档）     |
| Time                    | String      | 当前比赛时间，格式为 `mm:ss`         |
| ActionNo                | Number      | 动作序号（按先后顺序依次递增）       |
| HasPosition             | String(Y/N) | 是否有落点                           |
| PointX                  | String      | 落点 X 坐标（无则为 0）              |
| PointY                  | String      | 落点 Y 坐标（无则为 0）              |
| IsFastBreak             | String(Y/N) | 是否快攻                             |
| ActionOwnerType         | String      | 动作发生者类型（Player/Team/Coach）  |
| ActionOwnerRegisterCode | String      | 动作发生者 ID（Team 为空，其他必填） |
| Direction               | String(1/2) | 进攻方向                             |
| ActionOwnerTeam         | String      | 动作发生者所在队伍（Home/Visit）     |
| ActionGroupNo           | Number      | 所属动作组序号，动作组依次递增       |

##### 2.3.2.2 返回示例

示例：

```JSON
{
    "Message": {
        "Date": "20200710",
        "Time": "172717",
        "ActionList": [
            {
                "ActionCode": "2PM000",
                "HomeScore": 2,
                "VisitScore": 0,
                "Period": 1,
                "Time": "10:00",
                "ActionNo": "1",
                "ActionGroupNo": "1",
                "HasPosition": "N",
                "PointX": "",
                "PointY": "",
                "IsFastBreak": "N",
                "ActionOwnerType": "Player",
                "ActionOwnerRegisterCode": "20332",
                "Direction": 1,
                "ActionOwnerTeam": "Home"
            },
            // more action
        ]
    }
}
```

#### 2.3.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头

### 2.4 获取队伍信息

- 接口说明：获取某场比赛的队伍信息，包括队伍中的球员信息
- 接口地址：`/api/matchstatistics/teaminfo`

#### 2.4.1 请求参数

| 参数名称                            | 类型   | 是否必须 | 描述          |
| ----------------------------------- | ------ | :------: | ------------- |
| **\*header**                        |        |          | 头部          |
| _[公共请求头部](##12-公共请求头部)_ |        |    是    |               |
| match-code                          | String |    是    | 某场比赛的 ID |
|                                     |        |          |               |
| **\*body**                          |        |          | body          |
| 无                                  |        |          |               |

#### 2.4.2 返回 `Body`

示例：

```JSON
{
    "Message": {
        "Date": "20200710",
        "Time": "172402",
        "TeamList": [
            {
                "RegisterCode": "2570",
                "LongName": "社区队",
                "ShortName": "社区队",
                "CountryOrRegion": "China",
                "NOC": "CHN",
                "TeamType": "Home",
                "PlayerList": [
                    {
                        "Bib": "7",
                        "RegisterCode": "20330",
                        "LongName": "苏鹤鸣",
                        "ShortName": "苏鹤鸣",
                        "Height": 0,
                        "Birthday": "2009-01-01",
                        "Position": "F",
                        "IsInTeamRoster": "Y",
                        "IsStartLineUp": "Y",
                        "IsInField": "Y",
                        "CountryOrRegion": "中国",
                        "NOC": "CHN"
                    },
                    // more player
                ],
                "OfficialList": []
            },
            // more (Visit Team)
        ]
    }
}
```

::: TIP
返回的内容包含主客队的所有球员、教练员、裁判员
:::

#### 2.4.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头

### 2.5 更新比赛信息

- 接口说明：更新某场比赛信息，包括比赛状态，当前小节，当前比分等
- 接口地址：`/api/matchstatistics/pushmatch`

#### 2.5.1 请求参数

| 参数名称                            | 类型   | 是否必须 | 描述                                                               |
| ----------------------------------- | ------ | :------: | ------------------------------------------------------------------ |
| **\*header**                        |        |          | 头部                                                               |
| _[公共请求头部](##12-公共请求头部)_ |        |    是    |                                                                    |
| match-code                          | String |    是    | 某场比赛的 ID                                                      |
|                                     |        |          |                                                                    |
| **\*body**                          |        |          | body                                                               |
| CurrentPeriod                       | String |    是    | 当前小节                                                           |
| PeriodStatus                        | String |    是    | 小节状态（1 未开始，2 开始，3 结束）                               |
| HomePoint                           | Number |    是    | 当前主队比分                                                       |
| VisitPoint                          | Number |    是    | 当前客队比分                                                       |
| MatchStatus                         | String |    是    | 当前比赛状态（0 未开始，1 开始，2 中断，3 非官方，4 官方，5 修改） |
| PeriodList                          | Array  |    是    | 每小节的信息                                                       |
| PeriodList.PeriodCode               | Array  |    是    | 该小节序号 （依次递增）                                            |
| PeriodList.HomePeriodPoint          | Array  |    是    | 该小节主队比分                                                     |
| PeriodList.VisitPeriodPoint         | Array  |    是    | 该小节客队比分                                                     |
| PeriodList.PeriodStatus             | Array  |    是    | 该小节状态（与`CurrentPeriod`用法相同）                            |

::: WARNING
每次都需要有前四个小节信息，如果有加时赛，则需要传入全部小节信息。
:::

`body`示例：

```JSON
{
  "MatchCode": "1004235",
  "Date": "20200709",
  "Time": "170105",
  "Statistic_Type": "33",
  "Match": {
    "CurrentPeriod": "1",
    "PeriodStatus": "2",
    "HomePoint": 12,
    "VisitPoint": 12,
    "MatchStatus": "1",
    "PeriodList": [
      {
        "PeriodCode": 1,
        "HomePeriodPoint": 12,
        "VisitPeriodPoint": 12,
        "PeriodStatus": "3"
      },
      // more
    ]
  }
}
```

`header`示例：

```
POST /api/matchstatistics/pushmatch HTTP/1.1
user-id: 21424
source: ab159ef0fcb6fd7b45e87b629774613e
access-token: c3862a51bc5c95b6200dca727bc9ff42
Content-Type: application/json
seq-no: 6372988206597210000
terminal-type: Web
time-stamp: 1594285265

```

#### 2.5.2 返回 `Body`

无

#### 2.5.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头

### 2.6 更新队伍信息

- 接口说明：更新某场比赛的队伍信息，包括队伍中球员的信息
- 接口地址：`/api/matchstatistics/pushteaminfo`

#### 2.6.1 请求参数

| 参数名称                            | 类型   | 是否必须 | 描述          |
| ----------------------------------- | ------ | :------: | ------------- |
| **\*header**                        |        |          | 头部          |
| _[公共请求头部](##12-公共请求头部)_ |        |    是    |               |
| match-code                          | String |    是    | 某场比赛的 ID |
|                                     |        |          |               |
| **\*body**                          |        |          | body          |
| 见示例                              |        |          |               |

`body`示例：

```JSON
{
  "MatchCode": "1004235",
  "Date": "20200709",
  "Time": "170105",
  "TeamList": [
    {
      "RegisterCode": "2570",
      "LongName": "社区队",
      "ShortName": "社区队",
      // more
      "PlayerList": [
        {
          "Bib": "7",
          "RegisterCode": "20330",
          "LongName": "苏鹤鸣",
          "ShortName": "苏鹤鸣",
          "Height": 0,
          // more
        },
        // more
      ],
      "OfficialList": [],
      "Color": "##FFD700"
    },
    {
      "RegisterCode": "2578",
      // more
      "PlayerList": [
        {
          "Bib": "4",
          // more
        },
        // more
      ],
      "OfficialList": [],
      "Color": "##FF0000"
    }
  ]
}
```

::: TIP
球员、裁判、教练、队伍信息，格式与 [2.2 获取比赛列表](##22-获取比赛列表) 类似。
需要传入所有球员、裁判、教练、队伍。
:::

`header`示例：

```
POST /api/matchstatistics/pushteaminfo HTTP/1.1
user-id: 21424
source: 409d008ecf9b374ad1ed6a6b3ef50d38
access-token: c3862a51bc5c95b6200dca727bc9ff42
Content-Type: application/json
seq-no: 6372988206613810000
terminal-type: Web
time-stamp: 1594285266
```

#### 2.6.2 返回 `Body`

无

#### 2.6.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头

### 2.7 添加动作

- 接口说明：添加某场比赛的一个动作，如加分、犯规、换人等
- 接口地址：`/api/matchstatistics/updateactionstatistics`

#### 2.7.1 请求参数

| 参数名称                            | 类型        | 是否必须 | 描述                                 |
| ----------------------------------- | ----------- | :------: | ------------------------------------ |
| **\*header**                        |             |          | 头部                                 |
| _[公共请求头部](##12-公共请求头部)_ |             |    是    |                                      |
| match-code                          | String      |    是    | 某场比赛的 ID                        |
|                                     |             |          |                                      |
| **\*body**                          |             |          | body                                 |
| HomeScore                           | Number      |    是    | 主队比分                             |
| VisitScore                          | Number      |    是    | 客队比分                             |
| Period                              | Number      |    是    | 该动作发生的阶段                     |
| ActionCode                          | String      |    是    | 动作类型（详情参考动作类型文档）     |
| Time                                | String      |    是    | 当前比赛时间，格式为 `mm:ss`         |
| ActionNo                            | Number      |    是    | 动作序号（按先后顺序依次递增）       |
| HasPosition                         | String(Y/N) |    否    | 是否有落点                           |
| PointX                              | String      |    否    | 落点 X 坐标（无则为 0）              |
| PointY                              | String      |    否    | 落点 Y 坐标（无则为 0）              |
| IsFastBreak                         | String(Y/N) |    否    | 是否快攻                             |
| ActionOwnerType                     | String      |    是    | 动作发生者类型（Player/Team/Coach）  |
| ActionOwnerRegisterCode             | String      |    否    | 动作发生者 ID（Team 为空，其他必填） |
| Direction                           | String(1/2) |    是    | 进攻方向                             |
| ActionOwnerTeam                     | String      |    是    | 动作发生者所在队伍（Home/Visit）     |
| ActionGroupNo                       | Number      |    是    | 所属动作组序号，动作组依次递增       |

::: TIP
如进球有人助攻，则改助攻动作与进球动作为同组，即 ActionGroupNo 相同。若非同组动作，各动作的 ActionGroupNo 不会重复。
:::

`body`示例：

```JSON
{
  "MatchCode": "1004235",
  "Date": "20200709",
  "Time": "171742",
  "Statistic_Type": "33",
  "Action": {
    "HomeScore": 12,
    "VisitScore": 14,
    "ActionCode": "2PM000",
    "Period": 1,
    "Time": "02:15",
    "ActionNo": 12,
    "HasPosition": "N",
    "PointX": "0",
    "PointY": "0",
    "IsFastBreak": "N",
    "ActionOwnerType": "Player",
    "ActionOwnerRegisterCode": "20351",
    "Direction": "2",
    "ActionOwnerTeam": "Visit",
    "ActionGroupNo": 12
  }
}
```

`header`示例：

```
POST /api/matchstatistics/pushaction HTTP/1.1
user-id: 21424
source: 0304d7760ada9eb1ee4aec1d9b2bf579
access-token: c3862a51bc5c95b6200dca727bc9ff42
Content-Type: application/json
seq-no: 6372988306267710000
terminal-type: Web
time-stamp: 1594286262
```

#### 2.7.2 返回 `Body`

无

#### 2.7.3 返回 `Header`

除 [1.4 公共返回头](##14-公共返回头) 外无其他返回头
