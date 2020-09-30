function scheduleHtmlParser(html) {

    let result = [];
    let trList = $('#table tr');

    // 遍历上课 节数 i = 第几节
    for (let i = 1; i < trList.length; i++) {

        let tr = trList.eq(i);
        let tdList = tr.children();
        // 遍历星期 j = 星期几
        for (let j = 1; j < tdList.length; j++) {

            let td = tdList.eq(j);

            let courses = td.find("div"); // 一节课包含第十八周
            if (courses.length >= 2) {};

            // 遍历课程
            for (let k = 0; k < courses.length; k++) {
                let re = { name: "", position: "", teacher: "", weeks: [], day: "", sections: [] };
                let course = courses.eq(k);
                re.day += "" + j;
                re.sections.push({ section: i });
                // 课程名称
                let name = course.find("span").eq(0).text();
                re.name = name;
                // 地点
                let place = course.find(".place").text();
                re.position = place;
                // 任课老师
                let teacher = course.find(".teacher").text();
                re.teacher = teacher;

                // 课程所在周 // 所在周转换为数字函数 weekDetailToNumber()
                let weekDetail = course.find(".weekDetail").text();
                let weekTotal = weekDetail.split(","); //第1-5周,7-18周 //
                let weekflag = 0;
                if (weekTotal.length === 1) { //第6周,1-18周
                    if (weekTotal[0].search("-") === -1) { //"第6周"
                        re.weeks.push(parseInt(weekTotal[0].replace(/[^0-9]/ig, "")));
                    } else if (weekTotal[0].search("-") != -1) { //"第1-18周"
                        weekflag = weeksCheck(weekTotal[0]);
                        let weekTemp = weekTotal[0].split('-'); //[第1,18周]
                        let weekStart = parseInt(weekTemp[0].replace(/[^0-9]/ig, "")); //1
                        let weekEnd = parseInt(weekTemp[1].replace(/[^0-9]/ig, "")); //18
                        if (weekflag === 1) {
                            for (let j = weekStart; j <= weekEnd; j++) {
                                if (j % 2 === 1) {
                                    re.weeks.push(j);
                                }
                            }
                        } else if (weekflag === 2) {
                            for (let j = weekStart; j <= weekEnd; j++) {
                                if (j % 2 === 0) {
                                    re.weeks.push(j);
                                }
                            }
                        } else {
                            for (let j = weekStart; j <= weekEnd; j++) {
                                re.weeks.push(j);
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < weekTotal.length; i++) {
                        weekflag = weeksCheck(weekTotal[i]);
                        let weekTemp = weekTotal[i].split('-'); //"第1-5周,第7-18周"
                        let weekStart = parseInt(weekTemp[0].replace(/[^0-9]/ig, ""));
                        let weekEnd = parseInt(weekTemp[1].replace(/[^0-9]/ig, ""));
                        if (weekflag === 1) {
                            for (let j = weekStart; j <= weekEnd; j++) {
                                if (j % 2 === 1) {
                                    re.weeks.push(j);
                                }
                            }
                        } else if (weekflag === 2) {
                            for (let j = weekStart; j <= weekEnd; j++) {
                                if (j % 2 === 0) {
                                    re.weeks.push(j);
                                }
                            }
                        } else {
                            for (let j = weekStart; j <= weekEnd; j++) {
                                re.weeks.push(j);
                            }
                        }
                    }
                }
                let flag = -1;
                for (let i = 0; i < result.length; i++) {
                    if (re.name === result[i].name && re.position === result[i].position && re.sections[0].section === result[i].sections[0].section && re.teacher != result[i].teacher) {
                        flag = i;
                    }
                }
                if (flag != -1) {
                    result[flag].teacher = result[flag].teacher + "/" + re.teacher;
                    //这里只添加了老师，没有把周数添加进来
                } else {
                    result.push(re);
                }
            }


        }
    }
    //console.log(JSON.stringify({ courseInfos: result }));
    return { courseInfos: result };
}

function weeksCheck(classes) {
    if (classes.search("单周") != -1) {
        return 1;
    } else if (classes.search("双周") != -1) {
        return 2;
    } else {
        return 0;
    }
}