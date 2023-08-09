const cheerio = require('cheerio')
const fetch = require('node-fetch')

//  url = "https://m.saramin.co.kr/job-search/company-info-view?csn=QkZuWVo0YjU4TGlHOVYzekI4OGhCUT09"
//  # 재무정보 없음
//  url = "https://m.saramin.co.kr/job-search/company-info-view?csn=Rkl6K0ZtN2xFbk5ueTYxZUErd3ZoQT09"
//  # 재무정보 있음
//  url = "https://m.saramin.co.kr/job-search/company-info-view?csn=SUxRYitXUXo0SFZLdUFWNnRBTzNWQT09"
//  # 중간에 script가 있는 이상한 형태
//  url = "https://m.saramin.co.kr/job-search/company-info-view?csn=M3E3NC9VMmdwcEs3SmN2WDVYbWZGZz09"

const arr = [
  'https://www.saramin.co.kr/zf_user/company-info/view?csn=QkZuWVo0YjU4TGlHOVYzekI4OGhCUT09',
  'https://www.saramin.co.kr/zf_user/company-info/view?csn=Rkl6K0ZtN2xFbk5ueTYxZUErd3ZoQT09',
  'https://www.saramin.co.kr/zf_user/company-info/view?csn=SUxRYitXUXo0SFZLdUFWNnRBTzNWQT09',
  'https://www.saramin.co.kr/zf_user/company-info/view?csn=M3E3NC9VMmdwcEs3SmN2WDVYbWZGZz09',
  'https://www.saramin.co.kr/zf_user/company-info/view?csn=VnJPRHQzcmRvRW04WFNNV2gydVhJQT09',
  'https://www.saramin.co.kr/zf_user/company-info/view?csn=RlNYNTYwejlwQmM4UWhTVDg0c0dFQT09',
]

const getCsnValue = (url) => {
  const parsed_url = new URL(url)
  const query = parsed_url.searchParams.get('csn')

  return query
}

const getCompanySize = (type, $) => {
  const data = [
    $('div.box_company_view.company_intro > ul > li:nth-child(2) > div > button').text().trim(),
    $('div.box_company_view.company_intro > ul > li:nth-child(2) > strong').text().trim(),
    $('div.cont_company_view.introduce > div.box_company_view.company_intro > ul > li > div > button').text().trim(),
  ]

  if (data[0].length > 0 && $('div.box_company_view.company_intro > ul > li:nth-child(2) > span').text().trim() == type) {
    return data[0]
  }

  if (data[1].length > 0 && $('div.box_company_view.company_intro > ul > li:nth-child(2) > span').text().trim() == type) {
    return data[1]
  }

  if (data[2].length > 0 && $('div.box_company_view.company_intro > ul > li > span').text().trim() == type) {
    return data[2]
  }

  return '데이터없음'
}

const getCompanyInfo = async () => {
  try {
    await Promise.all(
      arr.map(async (r) => {
        const csn = getCsnValue(r)
        const response = await fetch(
          `https://www.saramin.co.kr/zf_user/company-info/view?csn=${encodeURI(
            csn,
          )}`,
        )
        const jobs = []
        if (response.status == 200) {
          const html = await response.text()
          const $ = cheerio.load(html)
          const title = $('#content > div > div.header_company_view > div.title_company_view > h1 > span.name').text().trim()
          const size = getCompanySize('기업형태', $);

          jobs.push({
            title,
            size,
            csn,
          })
        }
        console.log(jobs)
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

getCompanyInfo()
