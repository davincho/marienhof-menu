// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const fs = require('fs');
  const pdf = require('pdf-parse');


  let dataBuffer = await fetch('http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf')

  const weekdayStrings = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag'
  ];

  const weekdaysMenu = [

  ];

  const data = await pdf(dataBuffer) as { text: string }


  let weekdayCount = 0;

  let collector = []
  let startCollecting = false;
  const lines = data.text.split('\n').map(str => str.trim().replace(/  +/g, ' ')).filter(Boolean)

  for (const line of lines) {
    const weekdaySearch = weekdayStrings[weekdayCount];




    if (line === 'Menüplan') {
      // Date info
      console.log(line)
    } else if (line.replaceAll(' ', '') === weekdaySearch) {
      if (collector.length > 0) {
        weekdaysMenu.push(collector)
      }

      collector = [];
      startCollecting = true
      weekdayCount++;
    } else if (line.startsWith('V WOCHENEMPFEHLUNG')) {
      weekdaysMenu.push(collector)
      startCollecting = false
    } else if (startCollecting) {
      collector.push(line)
    }
  }

  console.log('weekdaysMenu', weekdaysMenu)

  // fix some line breaks

  const fixedDays = weekdaysMenu.map(weekday => {

    if (weekday.length === 3) {
      return weekday;
    }

    const fixedMenutItems = [];


    let concatMenu = []

    for (const menu of weekday) {
      if (menu.indexOf('€') > -1) {
        if (concatMenu.length === 0) {
          fixedMenutItems.push(menu)
        } else {
          concatMenu.push(menu)
          fixedMenutItems.push(concatMenu.join(', '))
          concatMenu = []
        }

      } else {
        concatMenu.push(menu)
      }
    }

    return fixedMenutItems;
  })

  console.log('fixedDays', fixedDays)

  res.status(200).json(fixedDays)



}
