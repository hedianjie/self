
import '../../public/css/public.css'
import '../../public/css/showdown.css'
import './index.css'
import $ from 'JQuery'
import showdownHighlight from 'showdown-highlight'
import ShowDown from 'showdown'

$('#btn').bind('click', function(){
    var text = $('#textarea').val();
    var  converter = new ShowDown.Converter({
        tables: true,
        tasklists: true,
        extensions: [showdownHighlight]
    }),
    html      = converter.makeHtml(text);
    $('#editor').html(html)
    console.log(html)

})

