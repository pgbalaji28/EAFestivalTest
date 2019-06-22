import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.festival.onCreated(function festivalOnCreated() {
  const template = this;
  template.bandList = new ReactiveVar(null);
  const showTimeData = showTime(template);
});

Template.festival.helpers({
  recordLabelList() {
    return Template.instance().bandList.get();
  }
});

getFestivalData = async () => {
  festivalResp = await new Promise((resolve, reject) =>
    Meteor.call("getFestivalData", (error, festivalResp) => {
      if (error) return reject(error);
      resolve(festivalResp);
    })
  );
  return festivalResp;
};
showTime = async (template) => {
  const festivalData = await getFestivalData();
  const transformedData = await transformFestivalData(festivalData.data);
  template.bandList.set(transformedData);
  return transformedData;
};

transformFestivalData = (festivalData) => {

  let bands = festivalData.map(f => {
    return f.bands
      .map(b => {
        return { recordLabel: b.recordLabel ? b.recordLabel : 'Not Given', bandName: b.name ? b.name : 'Not Given', festival: f.name ? f.name : 'Not Given' }
      })

  }).flat().sort((x, y) => {
    return x.recordLabel.localeCompare(y.recordLabel) || x.bandName.localeCompare(y.bandName) || x.festival.localeCompare(y.festival)
  });

  let recLabelGrp = [];
  let recLabelArr = [];
  bands.forEach(function (item) {
    recLabelGrp[item.recordLabel] = recLabelGrp[item.recordLabel] || {};
    var obj = recLabelGrp[item.recordLabel];
    if (Object.keys(obj).length == 0)
      recLabelArr.push(obj);
    obj.recordLabel = item.recordLabel;
    obj.bands = obj.bands || [];

    obj.bands.push({ band: item.bandName, festival: item.festival });
  });
  return recLabelArr;

}




