/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

const db = require('./db');

exports.getMailbox = async (req, res) => {
  const mailbox = req.query.mailbox;
  const allMail = await db.selectAllMail();
  const returnV = [];
  for (i=0; i < allMail.length; i++) {
    if (allMail[i]['mail'].Mailbox === mailbox) {
      allMail[i]['mail']['read']=600;
      allMail[i]['mail']['favorite']='grey';
      returnV.push(allMail[i]);
    }
  }
  for (i=0; i < returnV.length-1; i++) {
    for (j=0; j < returnV.length-i-1; j++) {
      if (returnV[j]['mail']['received']<returnV[j+1]['mail']['received']) {
        const temp = returnV[j];
        returnV[j] = returnV[j+1];
        returnV[j+1] = temp;
      }
    }
  }
  if (returnV.length > 0) {
    res.status(200).json(returnV);
  } else {
    res.status(400).json(returnV);
  }
};

