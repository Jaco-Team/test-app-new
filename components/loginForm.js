import React from 'react';

import Link from 'next/link'
import Image from 'next/image';

import Backdrop from '@mui/material/Backdrop';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';

import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';

import AccountIcon from '../public/account-icon-240x240.png'
import AccountIconWhite from '../public/account-icon-240x240_white.png'
import TrippleDop from '../public/tripple_dop.png'
import Like from '../public/like.png'
import { IconClose, MyTextInput } from './elements.js'

import AuthCode from 'react-auth-code-input';

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });
  
    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export class ModalLogin extends React.Component{
    sms1 = false;

    constructor(props) {
        super(props);
        
        this.state = {      
            open: false,

            typeLogin: 'start',
            fromType: 'start',
            loginLogin: '',
            pwdLogin: '',
            newPassword: '',
            genPwd: '',
            checkCode: '',

            pwd: '',
            ResPWD: false,
            NeedCode: false,
            

            openLogin: false,
            userLogin: '',
            userLoginFormat: '',
            userCode: '',
            
            timerSMS: 89,
            timerSMSTime: this.toTime(89),
            errPhone: '',
            errSMS: '',

            errTitle: '',
            errText1: '',
            errText2: '',

            is_sms: true
        };
    }

    componentDidUpdate(){
        if( this.props.isOpen != this.state.open ){
            this.setState({
                open: this.props.isOpen,
                typeLogin: 'start',
                fromType: 'start',
                loginLogin: '',
                pwdLogin: '',
                newPassword: '',
                genPwd: '',
                checkCode: '',
    
                pwd: '',
                ResPWD: false,
                NeedCode: false,
                
    
                openLogin: false,
                userLogin: '',
                userLoginFormat: '',
                userCode: '',
                
                timerSMS: 89,
                timerSMSTime: this.toTime(89),
                errPhone: '',
                errSMS: '',

                errTitle: '',
                errText1: '',
                errText2: '',
            })
        }
    }

    componentDidMount(){
        this.gen_password();
    }

    getData = (method, data = {}, is_load = true) => {
        if( is_load == true ){
            this.setState({
                is_load: true
            })
        }
        
        data.type = method;

        return fetch(config.urlApi, {
          method: 'POST',
          headers: {
            'Content-Type':'application/x-www-form-urlencoded'},
          body: queryString.stringify( data )
        }).then(res => res.json()).then(json => {
          return json;
        })
        .catch(err => { 
          setTimeout( () => {
            this.setState({
              is_load: false
            })
          }, 300 )
          console.log( err )
        });
    }  

    open(){
        this.setState({
            open: true
        })
    }

    close(){
        this.props.close();
        /*this.setState({
            open: false,
            fromType: 'start',
            typeLogin: 'start',
            loginLogin: '',
            pwdLogin: '',
            newPassword: '',
        })*/
    }

    changeData(type, event){
        let data = event.target.value;

        if( type == 'loginLogin' ){
            if( isNaN(data) && data != '+' ){
                return ;
            }

            if( parseInt(data[0]) == 9 ){
                data = '8' + data;
            }
            if( data[0] == '+' && parseInt(data[1]) == '7' ){
                data = data.slice(2);
                data = '8' + data;
            }
            if( parseInt(data[0]) == '7' ){
                data = data.slice(1);
                data = '8' + data;
            }

            data = data.split(' ').join('');
            data = data.split('(').join('');
            data = data.split(')').join('');
            data = data.split('-').join('');
            data = data.split('_').join('');
        }

        this.setState({
            [type]: data
        })
    }

    checkLoginKey(type, event){
        if( parseInt(event.keyCode) == 13 ){
            if( parseInt(type) == 1 ){
                this.logIn();
            }
            if( parseInt(type) == 2 ){
                this.sendSMS();
            }

            if( parseInt(type) == 3 ){
                this.checkCode();
            }

            if( parseInt(type) == 4 ){
                this.sendsmsNewLogin();
            }
        }
    }

    async logIn(){
        let data = {
            number: this.state.loginLogin,
            pwd: this.state.pwdLogin 
        };

        let res = await this.getData('site_login', data);

        if( res.st === false ){
            if( res.type == 'modal' ){
                this.setState({
                    typeLogin: 'error',
                    errTitle: res.title,
                    errText1: res.text1,
                    errText2: res.text2,
                });
            }else{
                this.setState({
                    errPhone: res.text
                });
            }
        }else{
            this.setState({ 
                errPhone: '',
                errTitle: '',
                errText1: '',
                errText2: '',
            })

            itemsStore.setToken( res.token, res.name ); 
            itemsStore.setUserName(res.name);

            this.close();
        }
    }

    async createProfileFetch(number, token){
        let data = {
            number: number,
            token: token 
        };

        this.setState({ 
            fromType: this.state.typeLogin,
            typeLogin: 'loginSMSCode'
        })

        let timerId = setInterval(() => {
            this.setState({
                timerSMS: this.state.timerSMS-1,
                timerSMSTime: this.toTime(this.state.timerSMS-1)
            })
            if( this.state.timerSMS == 0 ){
                clearInterval(timerId);
            }
        }, 1000);

        let res = await this.getData('create_profile', data);

        if( res['st'] === true ){
            this.setState({ 
                errPhone: '',
                errTitle: '',
                errText1: '',
                errText2: '',
                is_sms: res.is_sms
            })
        }else{
            if( res.type == 'modal' ){
                this.setState({
                    typeLogin: 'error',
                    errTitle: res.title,
                    errText1: res.text1,
                    errText2: res.text2,
                });
            }else{
                this.setState({
                    errPhone: res.text
                });
            }
        }
        
        setTimeout( () => {
            this.sms1 = false;
        }, 300 )
    }

    sendSMS(){
        if( this.sms1 == false ){
            this.sms1 = true;
            
            this.setState({
                timerSMS: 89,
                timerSMSTime: this.toTime(89),
            })

            let number = this.state.loginLogin;
            
            grecaptcha.ready(() => {
                grecaptcha.execute('6LdhWpIdAAAAAA4eceqTfNH242EGuIleuWAGQ2su', {action: 'submit'}).then( (token) => {
                    this.createProfileFetch(number, token);
                });
            });
        }
    }

    toTime(seconds) {
        let date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
    }

    changeCode(data){
        this.setState({
            checkCode: data
        })

        if( data.length == 4 ){
            setTimeout( () => {
                this.checkCode();
            }, 300 )
        }
    }

    async checkCode(){
        let data = {
            number: this.state.loginLogin,
            cod: this.state.checkCode 
        };

        let res = await this.getData('check_profile', data);

        if( res.st === false ){
            if( res.type == 'modal' ){
                this.setState({
                    typeLogin: 'error',
                    errTitle: res.title,
                    errText1: res.text1,
                    errText2: res.text2,
                });
            }else{
                this.setState({
                    errPhone: res.text
                });
            }
        }else{
            this.setState({ 
                errPhone: '',
                errTitle: '',
                errText1: '',
                errText2: '',
            })

            itemsStore.setToken( res.token, res.name ); 
            itemsStore.setUserName(res.name);

            if( this.state.fromType == 'create' ){
                this.setState({ 
                    fromType: this.state.typeLogin,
                    typeLogin: 'finish'
                })
            }else{
                this.close();
            }
        }
    }

    gen_password(){
        var password = "";
        var symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+?";
        for (var i = 0; i < 10; i++){
            password += symbols.charAt(Math.floor(Math.random() * symbols.length));     
        }
        
        this.setState({
            genPwd: password
        })
    }

    async sendsmsNewLoginFetch(token){
        let data = {
            number: this.state.loginLogin,
            pwd: this.state.newPassword,
            token: token 
        };

        this.setState({ 
            fromType: this.state.typeLogin,
            typeLogin: 'loginSMSCode'
        })

        let timerId = setInterval(() => {
            this.setState({
                timerSMS: this.state.timerSMS-1,
                timerSMSTime: this.toTime(this.state.timerSMS-1)
            })
            if( this.state.timerSMS == 0 ){
                clearInterval(timerId);
            }
        }, 1000);

        let json = await this.getData('sendsmsrp', data);

        if( json['st'] ){
            this.setState({ 
                errPhone: '',
                errTitle: '',
                errText1: '',
                errText2: '',
                is_sms: res.is_sms ?? false
            })
        }else{
            if( res.type == 'modal' ){
                this.setState({
                    typeLogin: 'error',
                    errTitle: res.title,
                    errText1: res.text1,
                    errText2: res.text2,
                });
            }else{
                this.setState({
                    errPhone: res.text
                });
            }
        }
        
        setTimeout( () => {
            this.sms1 = false;
            this.setState({
                is_load_new: false
            })
        }, 300 )
    }

    sendsmsNewLogin(){
        if( this.sms1 == false ){
            this.sms1 = true;
            
            grecaptcha.ready(() => {
                grecaptcha.execute('6LdhWpIdAAAAAA4eceqTfNH242EGuIleuWAGQ2su', {action: 'submit'}).then( (token) => {
                    this.sendsmsNewLoginFetch(token);
                });
            });
        }
    }

    render(){
        return (
            <Modal
                open={this.props.isOpen}
                onClose={this.props.close}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                className="class123"
                
            >
                <Fade in={this.props.isOpen}>
                    

                    { this.state.typeLogin != 'start' ? null :
                        <Box className='modalLoginStart'>

                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='loginIMG'>
                                <Image alt="Аккаунт" src={AccountIcon} width={180} height={180} />
                            </div>

                            <div className='loginHeader'>
                                <Typography component="h2">Мой аккаунт</Typography>
                            </div>
                            
                            <MyTextInput type={"phone"} placeholder="Телефон" value={ this.state.loginLogin } func={ this.changeData.bind(this, 'loginLogin') } onKeyDown={this.checkLoginKey.bind(this, 1)} className="inputLogin" />

                            <div className='loginErr'>
                                <Typography component="span">{this.state.errPhone}</Typography>
                            </div>

                            <MyTextInput type={"password"} placeholder="Пароль" value={ this.state.pwdLogin } func={ this.changeData.bind(this, 'pwdLogin') } onKeyDown={this.checkLoginKey.bind(this, 1)} className="inputLogin" />

                            <div className='loginLosePWD'>
                                <Typography component="span" onClick={ () => { this.setState({ fromType: this.state.typeLogin, typeLogin: 'resetPWD' }) } }>Забыли пароль ?</Typography>
                            </div>

                            <div className='loginLogin' onClick={this.logIn.bind(this)}>
                                <Typography component="span">Войти</Typography>
                            </div>

                            <div className='loginCreate' onClick={ () => { this.setState({ fromType: this.state.typeLogin, typeLogin: 'create' }); this.gen_password(); } }>
                                <Typography component="span">Создать новый аккаунт</Typography>
                            </div>

                            <div className='loginSMS'>
                                <Typography component="span" onClick={ () => { this.setState({ fromType: this.state.typeLogin, typeLogin: 'loginSMS' }) } }>Войти по смс</Typography>
                            </div>
                            
                        </Box>
                    }
                    { this.state.typeLogin != 'loginSMS' ? null :
                        <Box className='modalLoginCreate'>
                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='loginIMG'>
                                <Image alt="Аккаунт" src={AccountIcon} width={180} height={180} />
                            </div>

                            <div className='loginHeader'>
                                <Typography component="h2">Вход по СМС</Typography>
                            </div>
                            
                            <MyTextInput type={"phone"} placeholder="Телефон" value={ this.state.loginLogin } func={ this.changeData.bind(this, 'loginLogin') } onKeyDown={this.checkLoginKey.bind(this, 2)} className="inputLogin" style={{ marginBottom: 0 }} />
                            
                            <div className='loginErr'>
                                <Typography component="span">{this.state.errPhone}</Typography>
                            </div>

                            <div className='loginLogin' onClick={this.sendSMS.bind(this)}>
                                <Typography component="span">Получить код</Typography>
                            </div>
                            
                            <div className='loginCreate' onClick={ () => { this.setState({ fromType: this.state.typeLogin, typeLogin: 'start' }) } }>
                                <Typography component="span">У меня есть аккаунт</Typography>
                            </div>
                        </Box>
                    }
                    { this.state.typeLogin != 'loginSMSCode' ? null :
                        <Box className='modalLoginSMSCode'>
                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='loginIMG'>
                                <Image alt="Аккаунт" src={TrippleDop} width={180} height={180} />
                            </div>

                            <div className='loginHeader'>
                                <Typography component="h2">Проверим телефон ?</Typography>
                            </div>

                            { this.state.is_sms ? null :
                                <div className='loginSubHeader'>
                                    <Typography component="span">Сейчас мы вам позвоним.</Typography>
                                    <Typography component="span">Введите последние 4 цифры номера.</Typography>
                                </div>
                            }

                            { !this.state.is_sms ? null :
                                <div className='loginSubHeader'>
                                    <Typography component="span">Введите 4 цифры из смс.</Typography>
                                </div>
                            }
                            
                            <div className={this.state.timerSMS > 0 ? 'loginAutCode' : 'loginAutCodeOther'}>
                                <AuthCode autoFocus={true} allowedCharacters='numeric' length="4" onChange={ this.changeCode.bind(this) } />
                            </div>

                            <div className='loginErr'>
                                <Typography component="span">{this.state.errPhone}</Typography>
                            </div>

                            { this.state.timerSMS > 0 ?
                                <div className='loginTimer'>
                                    <Typography component="span">Повторно отправить можно через {this.state.timerSMSTime}</Typography>
                                </div>
                                    :
                                <div className='loginTimerSend' onClick={this.sendSMS.bind(this)}>
                                    <Typography component="span">Отправить код еще раз</Typography>
                                </div>
                            }
                            
                            <div className={'loginSend ' + (this.state.checkCode.length == 4 ? '' : 'disabled') } onClick={this.checkCode.bind(this)}>
                                <Typography component="span">Отправить</Typography>
                            </div>
                            
                            <div className='loginPrev'>
                                <Typography component="span" onClick={ () => { this.setState({ typeLogin: this.state.fromType }) } }>Изменить номер телефона</Typography>
                            </div>
                        </Box>
                    }
                    { this.state.typeLogin != 'resetPWD' ? null :
                        <Box className='modalLoginReset'>
                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='loginIMG'>
                                <Image alt="Аккаунт" src={AccountIcon} width={180} height={180} />
                            </div>

                            <div className='loginHeader'>
                                <Typography component="h2">Восстановление пароля</Typography>
                            </div>
                            
                            <MyTextInput type={"phone"} placeholder="Телефон" value={ this.state.loginLogin } func={ this.changeData.bind(this, 'loginLogin') } onKeyDown={this.checkLoginKey.bind(this, 4)} className="inputLogin" />
                            
                            <div className='loginErr'>
                                <Typography component="span">{this.state.errPhone}</Typography>
                            </div>

                            <MyTextInput type={"password"} placeholder="Придумай пароль" value={ this.state.newPassword } func={ this.changeData.bind(this, 'newPassword') } onKeyDown={this.checkLoginKey.bind(this, 4)} className="inputLogin" />

                            <div className='loginLogin' onClick={this.sendsmsNewLogin.bind(this)}>
                                <Typography component="span">Сменить пароль</Typography>
                            </div>
                            
                            <div className='loginCreate' onClick={ () => { this.setState({ fromType: this.state.typeLogin, typeLogin: 'start' }) } }>
                                <Typography component="span">У меня есть аккаунт</Typography>
                            </div>
                        </Box>
                    }
                    { this.state.typeLogin != 'create' ? null :
                        <Box className='modalLoginCreateNew'>
                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='loginIMG'>
                                <Image alt="Аккаунт" src={AccountIconWhite} width={180} height={180} />
                            </div>

                            <div className='loginHeader'>
                                <Typography component="h2">Новый аккаунт</Typography>
                            </div>
                            
                            <MyTextInput type={"phone"} placeholder="Телефон" value={ this.state.loginLogin } func={ this.changeData.bind(this, 'loginLogin') } onKeyDown={this.checkLoginKey.bind(this, 4)} className="inputLogin" />

                            <div className='loginErr'>
                                <Typography component="span">{this.state.errPhone}</Typography>
                            </div>

                            <MyTextInput type={"password"} placeholder="Придумайте пароль" value={ this.state.newPassword } func={ this.changeData.bind(this, 'newPassword') } onKeyDown={this.checkLoginKey.bind(this, 4)} className="inputLogin" />

                            <div className='loginSubHeader'>
                                <Typography component="span">Надежный пароль - строчные и заглавные буквы, цифры и символы.</Typography>
                                <Typography component="span">Например: {this.state.genPwd}</Typography>
                            </div>

                            <div className='loginErrText'>
                                <Typography component="span"></Typography>
                            </div>

                            <div className='loginLogin' onClick={this.sendsmsNewLogin.bind(this)}>
                                <Typography component="span">Создать аккаунт</Typography>
                            </div>
                            
                            <div className='loginCreate' onClick={ () => { this.setState({ fromType: this.state.typeLogin, typeLogin: 'start' }) } }>
                                <Typography component="span">У меня есть аккаунт</Typography>
                            </div>
                        </Box>
                    }
                    { this.state.typeLogin != 'finish' ? null :
                        <Box className='modalLoginFinish'>
                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='loginIMG'>
                                <Image alt="Аккаунт" src={Like} width={180} height={180} />
                            </div>

                            <div className='loginHeader'>
                                <Typography component="h2">Добро пожаловать</Typography>
                            </div>
                            
                            <div className='loginSubHeader1'>
                                <Typography component="span">Теперь вы можете легко оформить онлайн-заказ с доставкой или забрать его самостоятельно из любого нашего кафе.</Typography>
                            </div>

                            <div className='loginSubHeader2'>
                                <Typography component="span"><Link to={'/samara/profile'} exact={ true } onClick={ this.close.bind(this) }>Укажите в профиле</Link> день рождения и мы заренее пришлём вам промокод на приятный подарок.</Typography>
                            </div>

                            <Link to={'/samara/'} exact={ true } className='loginLogin' onClick={ this.close.bind(this) }>
                                <Typography component="span">Перейти в меню</Typography>
                            </Link>
                            
                            <Link to={'/samara/cart'} exact={ true } className='loginCreate' onClick={ this.close.bind(this) }>
                                <Typography component="span">Открыть корзину</Typography>
                            </Link>
                        </Box>
                    }
                    { this.state.typeLogin != 'error' ? null :
                        <Box className='modalLoginError'>
                            <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.close.bind(this)}>
                                <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                            </IconButton>

                            <div className='InnerBorder'>
                                <div className='loginHeader'>
                                    <Typography component="h2">{this.state.errTitle}</Typography>
                                </div>
                                
                                <div className='loginSubHeader1'>
                                    <Typography component="span">{this.state.errText1}</Typography>
                                </div>

                                <div className='loginSubHeader2'>
                                    <Typography component="span">{this.state.errText2}</Typography>
                                </div>
                            </div>
                        </Box>
                    }
                </Fade>
            </Modal>
        )
    }
}