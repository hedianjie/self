
import '../../public/css/public.css'
import '../../public/css/showdown.css'
import './index.css'
import $ from 'JQuery'
import showdownHighlight from 'showdown-highlight'
import ShowDown from 'showdown'

import SparkMD5 from 'spark-md5'

$(function(){
    const dom = $('#file');
    const p = $('#progress');
    const info = $('#info')
    dom.change(function(e){
        const file = this.files[0];
        const fileArr = [];
        const fileRender = new FileReader();
        const spark = new SparkMD5.ArrayBuffer();
        const size = 2*1024*1024;
        const totalSize = file.size;
        const chunks = Math.ceil(totalSize / size);
        const filename = file.name.replace(/\.[a-zA-Z]+$/, '');
        const mime = /\.([a-zA-Z]+)$/.exec(file.name)[1];
        let currentChunk = 0;
        let hash;
        info.append(`切割碎片共：${chunks}`);


        fileRender.onload = e => {
            spark.append(e.target.result);
            currentChunk++;

            if(currentChunk >= chunks) {
                hash = spark.end();
                $.ajax({
                    url: '/package/beginUploadPackage',
                    type: 'post',
                    data: {
                        total: chunks,
                        hash,
                        filename,
                        mime,
                    },
                    success(result) {
                        if(result.status == 200) {
                            console.log(result)
                            send();
                        }
                        else if(result.status == 201) {
                            render(result.data)
                        }
                        else {
                            console.log(result);
                        }
                    }

                })
            }
            else {
                loadNext();
            }
        }

        const loadNext = () =>{
            const start = currentChunk * size;
            const end = (start + size) > totalSize ? totalSize : (start + size);
            const blob = file.slice(start, end);
            p.text(`正在进行第 ${currentChunk + 1} 个切片`)
            fileArr.push({
                size: end - start,
                index: currentChunk,
                total: chunks,
                blob,
            });

            fileRender.readAsArrayBuffer(blob)
        }

        const send = () => {
            const promiseArr = [];

            for(let i = 0; i < fileArr.length; i++) {
                const data = fileArr[i];
                const formData = new FormData();
                formData.append('file', data.blob)
                formData.append('filename', filename);
                formData.append('hash', hash);
                formData.append('index', i);
                formData.append('mime', mime)

                promiseArr.push(new Promise((resolve, reject) => {
                    $.ajax({
                        url: '/package/uploadPackage',
                        type: 'post',
                        dataType: 'json',
                        data: formData,
                        processData : false,
                        contentType : false,
                        success(result) {
                            if(result.status == 200) {
                                resolve(result)
                            }
                            else {
                                reject(result)
                            }
                        },
                        error(err) {
                            reject(err)
                        }
                    })
                }))
            }
            
            Promise.all(promiseArr)
            .then(res => {
                console.log(res);
                $.ajax({
                    url: '/package/mergeUploadPackage',
                    type: 'post',
                    data: {
                        total: chunks,
                        filename,
                        mime,
                        hash,
                        totalSize
                    },
                    success(result) {
                        render(result.data)
                        console.log(result)
                    },
                })
            })
            .catch(err => {
                console.log(err)
            })
        }

        loadNext()
    
    })
})
// 登录
$.ajax({
    type: 'post',
    url: '/login',
    data: {
        login_name: 'Hedianjie2112.',
        pwd: '123321'
    },  
    success(result) {
        // $.ajax({
        //     url: '/user',
        //     success() {
        //         $.ajax({
        //             url: '/login/logout',
        //             success() {
        //                 $.ajax({
        //                     url: '/user',
        //                 });
        //             }
        //         });
        //     }
        // });
        
    }
})


$('#btn').bind('click', function(){
    var text = $('#textarea')[0].innerText;

    var  converter = new ShowDown.Converter({
        tables: true,
        tasklists: true,
        extensions: [showdownHighlight]
    }),
    html      = converter.makeHtml(text);
    $('#editor').html(html)
    console.log(text)

});


const render = (data) => {
    $('#textarea').html(data.readme);

    let submit = {
        title: data.title || '这是一个标题这是一个标题这是一个标题',
        version: '11.120.111',
        version_description: '这是一个版本备注，这是一个版本备注，这是一个版本备注，这是一个版本备注，这是一个版本备注，这是一个版本备注，',
        description: data.desc || '本插件实现了uniapp下监听耳机按键消息的功能，主要监听的是安卓下广播的ACTION_MEDIA_BUTTON消息。我在最初测试的时候，发现使用uniapp的广播消息监听方法并不能很好的监听耳机按键消息，这是由于耳机消息的特殊性质决定的。就是必须要在程序里用AudioManager对象去注册消息监听，所以我封装了一个插件。~~~~',
        type_id: 11,
        cover_img: typeof data.cover_img === 'string' ? (data.cover_img || '').split(',') : data.cover_img,
        sample_img: typeof data.sample_img === 'string' ? (data.sample_img || '').split(',') : data.sample_img,
        readme_img: typeof data.readme_img === 'string' ? (data.readme_img || '').split(',') : data.readme_img,
        directory_name: data.directory_name,
        package_size: 1956557,
        package_download_url: data.bin,
        package_sample_url: data.demo,
        hash: data.hash,
        parent_id: 8
    }

    $.ajax({
        type: 'post',
        data: submit,
        url: '/package/createPackage',
        dataType: 'json',
        success(result) {
            console.log(result)
        },

    })
}