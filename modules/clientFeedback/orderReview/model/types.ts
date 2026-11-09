export type OrderReviewValue = string | number | boolean | string[];

export type OrderReviewOption = {
  label?: string;
  name?: string;
  param?: string;
  value?: string;
};

export type OrderReviewElement = {
  id: string;
  type:
    | 'rating'
    | 'input'
    | 'textarea'
    | 'checkbox'
    | 'checkboxGroup'
    | 'tagCloud'
    | 'heading'
    | 'discount';
  answerable: boolean;
  data?: {
    title?: string;
    label?: string;
    text?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
    showWhen?: 'positive' | 'negative';
    checkboxes?: Array<string | OrderReviewOption>;
    availableTags?: string[];
    conditions?: {
      stars?: Array<number | string>;
      products?: string[];
      categories?: string[];
    };
  };
};

export type OrderReviewTarget = {
  target_id: number;
  target_type: 'order' | 'order_type' | 'product';
  name: string;
  category_name?: string;
  form_id: number;
  type_id: number;
  elements: OrderReviewElement[];
};

export type OrderReviewFormData = {
  st: true;
  submitted?: boolean;
  feedback_ids?: number[];
  order?: {
    point_id: number;
    order_id: number;
    status_order: number;
    type_order: number;
  };
  targets: OrderReviewTarget[];
};

export type OrderReviewResponse = {
  target_id: number;
  element_id: string;
  value: OrderReviewValue;
};

export type OrderReviewAnswers = Record<string, OrderReviewValue>;
