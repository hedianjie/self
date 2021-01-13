import '../../public/css/public.css'
import './index.css'
import $ from 'jquery'

$.ajax({
    url: '/user',
    success(result) {
        console.log(result)
    }
})