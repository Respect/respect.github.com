$(document).ready(function() {
    $('#language').val('.en');                
    $('.lang').not('.en').hide();

    $('#language').change(function() {
        $('.lang').not($(this).val()).hide('fast');
        $('.lang' + $(this).val()).show('fast');                
    }); 
});