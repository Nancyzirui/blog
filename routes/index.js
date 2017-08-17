//加密模块
var crypto = require('crypto');
//User对象操作类
var User = require('../models/user.js');
module.exports = function (app) {
    //首页的路由
    app.get('/',function(req,res){
        res.render('index',{
            title:'首页',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
        // res.send('hello world')
    })
    //注册页面
    app.get('/reg',function(req,res){
    res.render('reg',{
        title:'注册',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
        })
    });
    app.post('/reg',function(req,res){
        //收集一下 post请求发过来的注册用户的用户名、密码、邮箱
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password-repeat'];
    var email = req.body.email;
    // console.log(name);
    // console.log(password);
    // console.log(password_re);
    // console.log(email);
        //1.检查密码是否一致
        if(password != password_re){
            //给出错误提示
            req.flash('error','两次密码不一致');
            //返回到注册页面去
            return res.redirect('/reg');
        }
        //2.对密码进行加密
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');
        // console.log(password);
        //3.实例化User类，赋值
        var newUser = new User({
            name:name,
            password:password,
            email:email
        })
        //槛车用户名在数据中是否已经存在可，如果已经存在，用户是不能注册的.
        User.get(newUser.name,function (err,user) {
            if (err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            //用户名重复了
            if(user){
                req.flash('error','用户名不能重复');
                return res.redirect('/reg');
            }
            //保存到数据库中
            newUser.save(function(err,user){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                //将用户的信息存放到session中去
                req.session.user = newUser;
                req.flash('success','注册成功');
                return res.redirect('/');
            })
        })
        // console.dir(newUser);
    })
    //登录页面
    app.get('/login',function(req,res){
        res.render('login',{
            title:'登录',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()


        })
    })
    //登录行为
    app.post('/login',function(req,res){

    })
    //发表页面
    app.get('/post',function(req,res){
        res.render('post',{
            title:'发布文章',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()

        })
    })
    //发表行为
    app.post('/post',function(req,res){

    })
    //退出
    app.get('/logout',function(req,res){

    })

}
