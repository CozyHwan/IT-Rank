const cheerio = require('cheerio')
const fetch = require('node-fetch')

const getHTML = async (keyword) => {
  try {
    const response = await fetch(
      `https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=${encodeURI(
        keyword,
      )}
            &recruitPage=1&recruitSort=relation&recruitPageCount=40&inner_com_type=&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10&show_applied=&quick_apply=&except_read=&ai_head_hunting=`,
    )
    return await response.text()
  } catch (error) {
    console.error(error)
  }
}

const parsing = async (page) => {
  const $ = cheerio.load(page)
  const $recruit = $('.item_recruit')
  const recruits = []

  $recruit.each((idx, node) => {
    const title = $(node)
      .find('.job_tit > a:eq(0)')
      .text()
      .trim()
    const company = $(node)
      .find('.corp_name > a:eq(0)')
      .text()
      .trim()
    const date = $(node)
      .find('.job_date >span:eq(0)')
      .text()
      .trim()
    const location = $(node)
      .find('.job_condition > span > a:eq(1)')
      .text()
      .trim()
    const url1 =
      'https://www.saramin.co.kr' +
      $(node).find('.corp_name > a:eq(0)').attr('href')
    const url2 =
      'https://www.saramin.co.kr' +
      $(node).find('.job_tit > a:eq(0)').attr('href')

    recruits.push({
      title,
      company,
      date,
      location,
      url1,
      url2,
    })
  })

  return recruits
}

const getRecruit = async (keyword) => {
  const html = await getHTML(keyword)
  const recruit = await parsing(html)
  return recruit
}

const getFullRecruit = async (keyword) => {
  let recruits = []
  let i = 1
  while (i <= 5) {
    const recruit = await getRecruit(
      `${keyword}&recruitPage=${i}&recruitSort=relation&recruitPageCount=40&inner_com_type=&company_cd=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10&show_applied=&quick_apply=&except_read=&ai_head_hunting=`,
    )
    recruits = recruits.concat(recruit)
    i++
  }

  return recruits
}

module.exports.getFullRecruit = getFullRecruit
