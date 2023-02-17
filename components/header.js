import React, {useEffect, useState} from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import Link from 'next/link'
import Image from 'next/image';

import JacoLogo from '../public/jaco-logo.png'
import JacoLogoMini from '../public/Logomini.png'

import { ModalLogin } from './loginForm.js'

import { BurgerIcon } from '../ui/Icons.js'
import { roboto } from '../ui/Font.js'
import ModalCity from '../modules/header/modalCity.js'
import { useHeaderStore } from './store.js';
import { shallow } from 'zustand/shallow'

import { autorun } from "mobx"
import itemsStore from './items-store.js';

export default React.memo(function Header(props) {

    const { city, city_list, cats, active_page } = props;
    
    const [ thisCity, setThisCity ] = useState('');
    const [ thisCityRU, setThisCityRU ] = useState('');
    const [ catList, setCatList ] = useState([]);
    const [ activePage, setActivePage ] = useState([]);
    const [ activeMenu, setActiveMenu ] = useState(false);
    const [ token, setToken ] = useState('');

    const { setActiveModalCity } = useHeaderStore( state => state, shallow );

    useEffect(() => {
        setThisCity(city);

        setThisCityRU( city_list.find( item => item.link == city )['name'] )
    }, [city]);

    useEffect(() => {
        setCatList(cats);
    }, [cats]);

    useEffect(() => {
        setActivePage(active_page);
    }, [active_page]);

    console.log('load header')
  
    function openCity(){

    }

    return (
        <div className={roboto.variable}>
            <AppBar position="fixed" className='headerNew' id='headerNew' elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Toolbar>
                    <div style={{ width: '4.51%' }} />
                    <Link href={"/"+city} style={{ width: '14.8%' }}>
                        <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true} />
                    </Link> 
                    <div style={{ width: '2.53%' }} />

                    <a style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={ () => setActiveModalCity(true) }>
                        <span className={'headerCat'}>{thisCityRU}</span>
                    </a>
                    <div style={{ width: '0.36%' }} />

                    { catList.map( (item, key) =>
                        <React.Fragment key={key}>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>{item.name}</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                    ) }
                    
                    <Link href={"/"+city+"/akcii"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                        <span className={activePage == 'akcii' ? 'headerCat activeCat' : 'headerCat'}>Акции</span>
                    </Link>
                    <div style={{ width: '0.36%' }} />

                    
                    <Link href={"/"+city+"/profile"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={ () => openCity() } >
                        <span className={activePage == 'profile' ? 'headerCat activeCat' : 'headerCat'}>Профиль</span>
                    </Link>
                            

                    <div style={{ width: '3.25%' }} />

                    <div style={{ width: '4.51%' }} />
                    
                </Toolbar>
            </AppBar>

            <AppBar position="fixed" className='headerNewMobile' id='headerNewMobile' elevation={2} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Toolbar>
                    <Link href={"/"}>
                        <Image alt="Жако доставка роллов и пиццы" src={JacoLogoMini} width={40} height={40} priority={true} />
                    </Link> 

                    <React.Fragment>
                        <BurgerIcon onClick={ () => setActiveMenu(true) } style={{ padding: 20, marginRight: -20 }} />
                        <SwipeableDrawer
                            anchor={'right'}
                            open={activeMenu}
                            onClose={() => setActiveMenu(false)}
                            onOpen={() => setActiveMenu(true)}
                        >
                            <List className={'LinkList '+roboto.variable}>
                                <ListItem disablePadding onClick={ () => { setActiveModalCity(true); setActiveMenu(false); } }>
                                    <a>{thisCityRU}</a> 
                                </ListItem>
                                <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                                    <Link href={"/"+city}>Меню</Link> 
                                </ListItem>
                                <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                                    <Link href={"/"+city+"/akcii"}>Акции</Link> 
                                </ListItem>
                                { token.length == 0 ? 
                                    <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                                        <a>Профиль</a> 
                                    </ListItem>
                                        :
                                    <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                                        <Link href={"/"+city+"/profile"}>Профиль</Link> 
                                    </ListItem>
                                }
                                <ListItem disablePadding onClick={ () => setActiveMenu(false) }>
                                    <Link href={"/"+city+"/contacts"}>Контакты</Link> 
                                </ListItem>
                            </List>
                        </SwipeableDrawer>
                    </React.Fragment>
                </Toolbar>
            </AppBar>

            <ModalCity />
        </div>
    )
})

class Header_old extends React.Component{
    is_load = false;

    constructor(props) {
        super(props);
        
        if( this.props && this.props.data ){
            this.is_load = true;

            /*itemsStore.setDops(this.props.data.all.other.cats.need_dop);
            itemsStore.setAllItems(this.props.data.all.other.cats.all_items);
            itemsStore.setAllItemsCat(this.props.data.all.other.cats.arr);
            itemsStore.setAllItemsCatNew(this.props.data.all.other.cats.main_cat);
            itemsStore.setFreeItems(this.props.data.all.other.cats.free_items);
            itemsStore.setBanners(this.props.data.all.other.cats.baners)
            itemsStore.setCityRU(this.props.data.all.other.cats.this_city_name_ru);
            itemsStore.setCity(this.props.city)*/
        }
        
        let this_city = this.props?.city_list.find( city => city.link == this.props.city );

        this.state = {      
            this_link: this.props.this_link ? this.props.this_link : '',
            categoryItemsNew: this.props.data ? this.props.data.all.other.cats.main_cat : [],
            
            categoryItems: this.props.data ? this.props.data.all.other.cats.arr : [],
            cartItems: [],
            
            is_load: false,
            is_load_new: false,
            openCity: false,
            cityName: this.props.city ? this.props.city : '',
            testData: [1, 2, 3, 4],
            cityList: this.props.city_list,
            
            openLoginNew: false,
            
            userName: '',
            token: '',
            
            soc_link: null,
            openDrawer: false,
            anchorEl: null,
            cityNameRu: this_city?.name ?? 'Город',

            city: this.props.city,
            catList: this.props.cats,
            activePage: this.props.active_page,
        };
    }

    openCity(){
        this.setState({
            openCity: true
        })
    }
    
    componentDidMount(){
        this.setState({
            is_load_new: true
        })

        autorun(() => {
            this.setState({
                token: itemsStore.getToken()
            })
        })
    }

    closeCity(){
        this.setState({
            openCity: false
        })
    }

    openLogin(event){
        event.preventDefault()

        if( this.state.token && this.state.token.length > 0 ){
            if (typeof window !== 'undefined') {
                window.location.pathname = '/'+this.state.cityName+'/profile';
            }
        }else{
            this.setState({
                openLoginNew: true
            })
        }
    }
    
    closeLogin(){
        this.setState({
            openLoginNew: false,
        })
    }

    toggleDrawer(open){
        this.setState({
            openDrawer: open
        })
    };

    render(){
        return (
            <div className={roboto.variable}>
                <AppBar position="fixed" className='headerNew' id='headerNew' elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Toolbar>
                        <div style={{ width: '4.51%' }} />
                        <Link href={"/"+this.state.city} style={{ width: '14.8%' }}>
                            <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true} />
                        </Link> 
                        <div style={{ width: '2.53%' }} />

                        <a style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={this.openCity.bind(this)}>
                            <span className={'headerCat'}>{this.state.cityNameRu}</span>
                        </a>
                        <div style={{ width: '0.36%' }} />

                        { this.state.catList.map( (item, key) =>
                            <React.Fragment key={key}>
                                <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                    <span className={'headerCat'}>{item.name}</span>
                                </Link> 
                                <div style={{ width: '0.36%' }} />
                            </React.Fragment>
                        ) }
                        
                        <Link href={"/"+this.state.city+"/akcii"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                            <span className={this.state.activePage == 'akcii' ? 'headerCat activeCat' : 'headerCat'}>Акции</span>
                        </Link>
                        <div style={{ width: '0.36%' }} />

                        
                        <Link href={"/"+this.state.city+"/profile"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={this.openLogin.bind(this)} >
                            <span className={this.state.activePage == 'profile' ? 'headerCat activeCat' : 'headerCat'}>Профиль</span>
                        </Link>
                                

                        <div style={{ width: '3.25%' }} />

                        <div style={{ width: '4.51%' }} />
                        
                    </Toolbar>
                </AppBar>

                <AppBar position="fixed" className='headerNewMobile' id='headerNewMobile' elevation={2} sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Toolbar>
                        <Link href={"/"}>
                            <Image alt="Жако доставка роллов и пиццы" src={JacoLogoMini} width={40} height={40} priority={true} />
                        </Link> 

                        <React.Fragment>
                            <BurgerIcon onClick={this.toggleDrawer.bind(this, true)} style={{ padding: 20, marginRight: -20 }} />
                            <SwipeableDrawer
                                anchor={'right'}
                                open={this.state.openDrawer}
                                onClose={this.toggleDrawer.bind(this, false)}
                                onOpen={this.toggleDrawer.bind(this, true)}
                            >
                                <List className={'LinkList '+roboto.variable}>
                                    <ListItem disablePadding onClick={ () => { this.toggleDrawer(false); this.openCity(); } }>
                                        <a>{this.state.cityNameRu}</a> 
                                    </ListItem>
                                    <ListItem disablePadding onClick={this.toggleDrawer.bind(this, false)}>
                                        <Link href={"/"+this.state.city}>Меню</Link> 
                                    </ListItem>
                                    <ListItem disablePadding onClick={this.toggleDrawer.bind(this, false)}>
                                        <Link href={"/"+this.state.city+"/akcii"}>Акции</Link> 
                                    </ListItem>
                                    { this.state.token.length == 0 ? 
                                        <ListItem disablePadding onClick={ () => { this.toggleDrawer(false); this.openLogin(); } }>
                                            <a>Профиль</a> 
                                        </ListItem>
                                            :
                                        <ListItem disablePadding onClick={this.toggleDrawer.bind(this, false)}>
                                            <Link href={"/"+this.state.city+"/profile"}>Профиль</Link> 
                                        </ListItem>
                                    }
                                    <ListItem disablePadding onClick={this.toggleDrawer.bind(this, false)}>
                                        <Link href={"/"+this.state.city+"/contacts"}>Контакты</Link> 
                                    </ListItem>
                                </List>
                            </SwipeableDrawer>
                        </React.Fragment>
                    </Toolbar>
                </AppBar>

                { !this.state.is_load_new ? null :
                    <>
                        <ModalCity isOpen={this.state.openCity} close={this.closeCity.bind(this)} cityList={this.state.cityList} cityName={this.state.cityName} />
                        <ModalLogin isOpen={this.state.openLoginNew} close={this.closeLogin.bind(this)} />
                    </>
                }
            </div>
        )
    }
}