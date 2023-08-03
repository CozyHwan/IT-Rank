const cheerio = require('cheerio')
const fetch = require('node-fetch')
const xlsx = require('xlsx')

const workbook = xlsx.readFile('../xlsx/data.xlsx')

const ws = workbook.Sheets.시트1
const records = xlsx.utils.sheet_to_json(ws)

for (const [i, r] of records.entries()) {
  // console.log(i,r.csn)
}

const crawler = async () => {
  try {
    await Promise.all(
      records.map(async (r) => {
        const response = await fetch(
          `https://www.saramin.co.kr/zf_user/company-info/view?csn=${encodeURI(
            r.csn,
          )}`,
        )

        const locations = []
        if (response.status == 200) {
          const html = await response.text()
          const $ = cheerio.load(html)
          const title = $('.title_company_view .name')
            .text()
            .trim()
          const url1 = $('.company_intro .info > dd:eq(2)')
            .text()
            .trim()
          const link = url1.replace('지도보기', '')
          const url3 = $('.company_intro .info > dd:eq(3)')
            .text()
            .trim()
          const link2 = url3.replace('지도보기', '')

          locations.push({
            title,
            link,
            link2,
          })
        }
        console.log(locations)
        return locations
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

crawler()
