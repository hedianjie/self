import '../../public/css/public.css'
import './index.css'
import SparkMD5 from 'spark-md5'
import $ from 'jquery'

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
// $.ajax({
//     type: 'post',
//     url: '/login',
//     data: {
//         login_name: 'Hedianjie2112.',
//         pwd: '123321'
//     },  
//     success(result) {
//         // $.ajax({
//         //     url: '/user',
//         //     success() {
//         //         $.ajax({
//         //             url: '/login/logout',
//         //             success() {
//         //                 $.ajax({
//         //                     url: '/user',
//         //                 });
//         //             }
//         //         });
//         //     }
//         // });
        
//     }
// })

$(function(){

    
})
// 注册
$.ajax({
    type: 'post',
    url: '/login/register',
    data: {
        login_name: 'Hedianjie2112.',
        pwd: '123321'
    },  
    success(result) {
        
    }
})

// 用户信息
// $.ajax({
//     type: 'get',
//     url: '/user',
//     // data: {
//     //     login_name: 'hedianjie2112.',
//     //     pwd: '123321'
//     // },  
//     success(result) {
        
//     }
// });


// 登出
// $.ajax({
//     url: '/login/logout',
//     success() {
//         $.ajax({
//             url: '/user',
//         });
//     }
// });