import { ModalAuthPC } from './ModalAuthPC';

export default {
  title: 'Header / ПК / Модалка Авторизации',
  component: ModalAuthPC,
  tags: ['autodocs'],
  argTypes: {
    typeLogin: {
      type: 'string',
      description: 'Тип модального окна при Авторизации',
    },
    data: {
      type: 'object',
      description: 'Данные для формы авторизации',
      showPassword: {
        type: 'boolean',
        description: 'Показать пароль',
      },
      errTextAuth: {
        type: 'string',
        description: 'Текст ошибки',
      },
      loginLogin: {
        type: 'string',
        description: 'Номер телефона',
      },
      pwdLogin: {
        type: 'string',
        description: 'Пароль',
      },
      checkAccord: {
        type: 'boolean',
        description: 'Согласие с политикой конфиденциальности',
      },
      checkPolitika: {
        type: 'boolean',
        description:
          'Согласие с условиями сбора и обработки персональных данных',
      },
      city: {
        type: 'string',
        description: 'Ссылка на город',
      },
      timerPage: {
        type: 'boolean',
        description: 'Состояние таймера',
      },
      code: {
        type: 'string',
        description: 'Код для входа',
      },
    },
  },
};

const Template = (args) => <ModalAuthPC {...args} />;
export const Start = Template.bind({});
export const Start_Error = Template.bind({});
export const Start_Enter = Template.bind({});
export const Start_Show_Password = Template.bind({});
export const ResetPWD = Template.bind({});
export const ResetPWD_Error = Template.bind({});
export const ResetPWD_Enter = Template.bind({});
export const ResetPWD_Show_Password = Template.bind({});
export const LoginSMS = Template.bind({});
export const LoginSMS_Error = Template.bind({});
export const LoginSMS_Enter = Template.bind({});
export const Create = Template.bind({});
export const Create_Enter = Template.bind({});
export const Create_Show_Password = Template.bind({});
export const Create_Done = Template.bind({});
export const LoginSMSCode = Template.bind({});
export const LoginSMSCode_Error = Template.bind({});
export const LoginSMSCode_Done = Template.bind({});
export const LoginSMSCode_End_Timer = Template.bind({});
export const Finish = Template.bind({});

Start.args = {
  typeLogin: 'start',
  data: {
    showPassword: false,
    errTextAuth: '',
    loginLogin: '',
    pwdLogin: '',
  },
};

Start_Error.args = {
  typeLogin: 'start',
  data: {
    showPassword: false,
    errTextAuth: 'Ошибочка',
    loginLogin: '',
    pwdLogin: '',
  },
};

Start_Enter.args = {
  typeLogin: 'start',
  data: {
    showPassword: false,
    errTextAuth: '',
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
  },
};

Start_Show_Password.args = {
  typeLogin: 'start',
  data: {
    showPassword: true,
    errTextAuth: '',
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
  },
};

ResetPWD.args = {
  typeLogin: 'resetPWD',
  data: {
    showPassword: false,
    errTextAuth: '',
    loginLogin: '',
    pwdLogin: '',
  },
};

ResetPWD_Error.args = {
  typeLogin: 'resetPWD',
  data: {
    showPassword: false,
    errTextAuth: 'Ошибочка',
    loginLogin: '',
    pwdLogin: '',
  },
};

ResetPWD_Enter.args = {
  typeLogin: 'resetPWD',
  data: {
    showPassword: false,
    errTextAuth: '',
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
  },
};

ResetPWD_Show_Password.args = {
  typeLogin: 'resetPWD',
  data: {
    showPassword: true,
    errTextAuth: '',
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
  },
};

LoginSMS.args = {
  typeLogin: 'loginSMS',
  data: {
    errTextAuth: '',
    loginLogin: '',
  },
};

LoginSMS_Error.args = {
  typeLogin: 'loginSMS',
  data: {
    errTextAuth: 'Ошибочка',
    loginLogin: '',
  },
};

LoginSMS_Enter.args = {
  typeLogin: 'loginSMS',
  data: {
    errTextAuth: '',
    loginLogin: '89000000000',
  },
};

Create.args = {
  typeLogin: 'create',
  data: {
    showPassword: false,
    loginLogin: '',
    pwdLogin: '',
    checkPolitika: false,
    checkAccord: false,
    city: 'samara',
  },
};

Create_Enter.args = {
  typeLogin: 'create',
  data: {
    showPassword: false,
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
    checkPolitika: false,
    checkAccord: false,
    city: 'samara',
  },
};

Create_Show_Password.args = {
  typeLogin: 'create',
  data: {
    showPassword: true,
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
    checkPolitika: false,
    checkAccord: false,
    city: 'samara',
  },
};

Create_Done.args = {
  typeLogin: 'create',
  data: {
    showPassword: true,
    loginLogin: '89000000000',
    pwdLogin: 'df44PP@pfv',
    checkPolitika: true,
    checkAccord: true,
    city: 'samara',
  },
};

LoginSMSCode.args = {
  typeLogin: 'loginSMSCode',
  data: {
    errTextAuth: '',
    loginLogin: '89000000000',
    code: '',
    timerPage: false,
  },
};

LoginSMSCode_Error.args = {
  typeLogin: 'loginSMSCode',
  data: {
    errTextAuth: 'Ошибочка',
    loginLogin: '89000000000',
    code: '',
    timerPage: false,
  },
};

LoginSMSCode_Done.args = {
  typeLogin: 'loginSMSCode',
  data: {
    errTextAuth: '',
    loginLogin: '89000000000',
    code: '7777',
    timerPage: false,
  },
};

LoginSMSCode_End_Timer.args = {
  typeLogin: 'loginSMSCode',
  data: {
    errTextAuth: '',
    loginLogin: '89000000000',
    code: '',
    timerPage: true,
  },
};

Finish.args = {
  typeLogin: 'finish',
};
