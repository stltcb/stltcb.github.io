
    function httpGet(theUrl) {
        let xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open("GET", theUrl, false);
        xmlHttpReq.send(null);
        return xmlHttpReq.responseText;
    }

    function getProgram() {
        // var data = httpGet('https://anilkkt.github.io/data/program.json');
        var data = httpGet('https://stltcb.github.io/data/slides.json');
        return JSON.parse(data);
    }

    function hideAll() {
        const slides = document.getElementsByClassName('slide');
        for(let i = 0; i<slides.length; i++) {
            slides[i].style.display = 'none';
        }
    }

    function showSlide(num) {
        hideAll();
        const slides = document.getElementsByClassName('slide');
        slides[num].style.display = "block";
    }

    function getSectionName(pgNumber) {
        let count = 0;
        const sections = document.getElementsByClassName('section');
        for(let i = 0; i<sections.length; i++) {
            const slides = sections[i].getElementsByClassName('slide');
            const sectionName = sections[i].getElementsByClassName('section-name')[0];
            count += slides.length;
            if (count > pgNumber) {
                return sectionName.innerText;
            }
        }
        return '';
    }

    function getSectionNumber(pgNumber) {
        let count = 0;
        const sections = document.getElementsByClassName('section');
        for(let i = 0; i<sections.length; i++) {
            const slides = sections[i].getElementsByClassName('slide');
            count += slides.length;
            if (count > pgNumber) {
                return i+1;
            }
        }
        return sections.length;
    }

    document.onkeydown = function (e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                nextSlide();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                previousSlide();
                break;
        }
    };

    function nextSlide() {
        pageNumber++;
        if (pageNumber >= pageLength) {
            pageNumber = pageLength-1;
        }
        showSlide(pageNumber);
        updateFooter();
    }

    function previousSlide() {
        pageNumber--;
        if(pageNumber < 0) {
            pageNumber = 0;
        }
        showSlide(pageNumber);
        updateFooter();
    }

    function stepBack() {
        const secNum = getSectionNumber(pageNumber);
        let count = 0;
        const sections = document.getElementsByClassName('section');
        for(let i = 0; i<sections.length; i++) {
            const slides = sections[i].getElementsByClassName('slide');
            if (slides.length > pgNumber) {
                break;
            }
            count += slides.length;
        }
        pageNumber = count;
        nextSlide();
    }

    function goBack() {
        const secNum = getSectionNumber(pageNumber);
        let count = 0;
        const sections = document.getElementsByClassName('section');
        for(let i = 0; i<sections.length; i++) {
            const slides = sections[i].getElementsByClassName('slide');
            if (slides.length > pageNumber) {
                break;
            }
            count += slides.length;
        }
        pageNumber = count;
        previousSlide();
    }

    function goHome() {
        pageNumber=0;
        previousSlide();
    }

    function increaseFont() {
        changeFont('song-title', 5);
        changeFont('song-verse-large', 5);
        changeFont('song-verse-right', 5);
    }

    function decreaseFont() {
        changeFont('song-title', -5);
        changeFont('song-verse-large', -5);
        changeFont('song-verse-right', -5);
    }

    function changeFont(className, delta) {
        var titles = document.getElementsByClassName(className);
        for (let i = 0; i < titles.length; i++) {
            const title = titles[i];
            var style = window.getComputedStyle(title, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            title.style.fontSize = (fontSize + (delta)) + 'px';
        }
    }

    function updateFooter() {
        const secName = getSectionName(pageNumber);
        const pageNum = document.getElementById('pageNumber');
        if (secName === '') {
            pageNum.innerText = `Slide: ${pageNumber + 1} `;
        }
        else {
            pageNum.innerText = `${secName} - Slide: ${pageNumber + 1} `;
        }
    }

    function getRootSlide(titleText, subTitleText) {
        const slide = getSlide();

        const title = document.createElement('p');
        title.classList.add('title');
        title.innerText = titleText;

        const subTitle = document.createElement('p');
        subTitle.classList.add('sub-title');
        subTitle.innerText = subTitleText;

        slide.appendChild(title);
        slide.appendChild(subTitle);

        return slide;
    }

    function getSummarySlide(objSections, subTitle) {

        const slide = getSlide();

        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        slide.appendChild(br1);
        slide.appendChild(br2);

        const title = document.createElement('p');
        title.classList.add('list-title');
        title.innerText = subTitle;

        const list = document.createElement('ul');
        list.classList.add('list');

        objSections.forEach(section => {
            const listItem = document.createElement('li');
            if (section.subtitle && section.subtitle === '' ) {
                listItem.innerText = `${section.title}`;
            }
            else {
                listItem.innerHTML = `${section.title} (<i>${section.subtitle}</i>)`;
            }
            list.appendChild(listItem);
            if (section.content) {
                const contentSummary = getSubSummary(section.content);
                list.appendChild(contentSummary);
            }
        });

        slide.appendChild(title);
        slide.appendChild(list);

        return slide;
    }

    function getSubSummary(content) {

        const list = document.createElement('ol');
        list.classList.add('list-order');

        content.forEach(element => {
            const listItem = document.createElement('li');
            listItem.innerText = element.heading;
            list.appendChild(listItem);
        });

        return list;
    }

    function getSectionHeaderSlide(titleText, subTitleText) {
        const slide = getSlide();

        const div = document.createElement('div');
        div.classList.add('section');

        const title = document.createElement('p');
        title.classList.add('section-title');
        title.innerText = titleText;

        const subTitle = document.createElement('p');
        subTitle.classList.add('section-sub-title');
        subTitle.innerText = subTitleText;

        div.appendChild(title);
        div.appendChild(subTitle);
        slide.appendChild(div);

        // slide.appendChild(title);
        // slide.appendChild(subTitle);

        return slide;
    }

    function getContentHeaderSlide(titleText) {
        const slide = getSlide();

        const title = document.createElement('p');
        title.classList.add('song-title');
        title.innerText = titleText;

        slide.appendChild(title);

        return slide;
    }

    function getContentLinesSlide(lines, initial, nextSlide) {
        const slide = getSlide();

        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        slide.appendChild(br1);
        slide.appendChild(br2);

        lines.forEach(lineText => {
            const line = document.createElement('p');
            line.classList.add('song-verse-large');
            line.innerText = lineText;
            slide.appendChild(line);
        });
        if (initial) {
            const line = document.createElement('p');
            line.classList.add('song-verse-right');
            line.innerText = `||${initial}||`;
            slide.appendChild(line);
        }
        else  if (lines.length < 6 && nextSlide) {
            const hr = document.createElement('hr');
            slide.appendChild(hr);

            const b1 = document.createElement('br');
            slide.appendChild(b1);
            const nl = document.createElement('p');
            nl.classList.add('song-verse-small');
            nl.innerText = nextSlide.lines[0];
            slide.appendChild(nl);
        }

        return slide;
    }

    function getChorusSlide(lines, header, chorusLines, nextSlide) {
        const slide = getSlide();

        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        slide.appendChild(br1);
        slide.appendChild(br2);

        for (let i = 0; i < chorusLines; i++) {
            var lineText = lines[i];
            if (lineText && lineText.indexOf('(') > 0) {
                lineText = lineText.split('(')[0];
            }
            const line = document.createElement('p');
            line.classList.add('song-verse-large');
            line.innerText = lineText;
            slide.appendChild(line);
        }

        if (lines.length < 6 && nextSlide) {
            const hr = document.createElement('hr');
            slide.appendChild(hr);

            const b1 = document.createElement('br');
            slide.appendChild(b1);
            const nl = document.createElement('p');
            nl.classList.add('song-verse-small');
            nl.innerText = nextSlide.lines[0];
            slide.appendChild(nl);
        }

        return slide;
    }

    function getSection(slides, name) {
        const section = document.createElement('div');
        section.classList.add('section');

        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.classList.add('section-name');
        if (name) {
            input.innerText = name;
        }
        else {
            input.innerText = '';
        }
        section.appendChild(input);

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            section.appendChild(slide);
        }

        return section;
    }

    function getSlidesForSection(section) {

        const slides = [];

        const headerSlide = getSectionHeaderSlide(section.title, section.subtitle);
        slides.push(headerSlide);

        if (section.content) {
            for (let index = 0; index < section.content.length; index++) {
                const content = section.content[index];
                const contentHeaderSlide = getContentHeaderSlide(content.heading);
                slides.push(contentHeaderSlide);
                if (content.slides) {
                    const slideLen = content.slides.length;
                    for (let j = 0; j < slideLen; j++) {
                        const slide = content.slides[j];
                        const nextSlide = (j < (slideLen-1)) ? content.slides[j+1] : undefined;
                        const linesSlide = getContentLinesSlide(slide.lines, (j===0)? '' : content.initial, nextSlide);
                        slides.push(linesSlide);
                        if (j > 0 && content.choruslines && content.choruslines > 0) {
                            const chorusSlide = getChorusSlide(content.slides[0].lines, content.heading, content.choruslines, nextSlide);
                            slides.push(chorusSlide);
                        }
                    }
                }
            }
        }

        return slides;
    }

    function getSlide() {
        const section = document.createElement('div');
        section.classList.add('slide');
        return section;
    }

    function addProgram(obj) {

        if(!obj) {
            obj = getProgram();
        }

        const dateLabel = document.getElementById('date');
        dateLabel.innerText = `Date: ${obj.date}`;

        const body = document.getElementById('presentation');
        const rootSlide = getRootSlide(obj.title, obj.subtitle);
        const rootSection = getSection([rootSlide], '');

        obj.background = 'https://www.w3schools.com/howto/img_parallax.jpg';
        obj.background = 'https://i.swncdn.com/media/800w/via/8133-sunburst-through-lilac-clouds-in-sky-rising-c.webp';

        const backGround = document.getElementById('backGround');
        if (obj.background) {
            backGround.style.backgroundImage = `url("${obj.background}")`;
        }

        body.appendChild(rootSection);

        const summarySlide = getSummarySlide(obj.sections, obj.subtitle);
        const summarySection = getSection([summarySlide], 'Summary');
        body.appendChild(summarySection);


        for (let index = 0; index < obj.sections.length; index++) {
            const objSection = obj.sections[index];
            const sectionSlides = getSlidesForSection(objSection);
            const viewSection = getSection(sectionSlides, objSection.name);
            body.appendChild(viewSection);
        }
    }

    function enableBroadcast(channelName) {
        const bc = new BroadcastChannel(channelName);
        var allButtons = document.querySelectorAll('button[type^=button]');
        for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].addEventListener('click', function() {
                console.clear();
                console.log("You clicked:", this.innerHTML);
                bc.postMessage(this.id);
            });
        }
    }

    function handleBroadcast(channelName) {
        const bc = new BroadcastChannel(channelName);
        bc.onmessage = function (ev) {
            console.log(ev.data);
            document.getElementById(ev.data).click();
        }
    }
