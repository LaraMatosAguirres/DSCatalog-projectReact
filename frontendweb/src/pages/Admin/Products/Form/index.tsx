import { Controller, useForm } from 'react-hook-form';
import { Product } from '../../../../types/product';
import './styles.css';
import { requestBackend } from '../../../../util/requests';
import { AxiosRequestConfig } from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Category } from '../../../../types/category';
import CurrencyInput from 'react-currency-input-field';
import { toast } from 'react-toastify';

type UrlParams = {
  productId: string;
};

const Form = () => {

  const [selectCategories, setSelectCategories] = useState<Category[]>([]);

  const { productId } = useParams<UrlParams>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Product>();

  const history = useHistory();

  const isEditing = productId !== 'create';

  useEffect(() => {
    requestBackend({url: '/categories'})
    .then(response => {
      setSelectCategories(response.data.content)
    })
  }, [])

  useEffect(() => {
    if (isEditing) {
      requestBackend({ url: `/products/${productId}` }).then((response) => {
        const product = response.data as Product;

        setValue('name', product.name);
        setValue('price', product.price);
        setValue('description', product.description);
        setValue('imgUrl', product.imgUrl);
        setValue('categories', product.categories);
      });
    }
  }, [isEditing, productId, setValue]);

  const onSubmit = (formData: Product) => {
   
    const data = {...formData, price: String(formData.price).replace(',','.')}

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `products/${productId}` : '/products',
      data,
      withCredentials: true,
    };

    requestBackend(config).then((response) => {
      console.log(response.data);
    });

    requestBackend(config).then((response) => { 
    toast.info('Produto cadastrado com sucesso');
    history.push('/admin/products')})
    .catch(() => {
      toast.error('Error ao cadastrar produto');
    });
  };

  const handleCancel = () => {
    history.push('/admin/products');
  };

  return (
    <div className="product-crud-container">
      <div className="base-card product-crud-form-card">
        <h1 className="product-crud-form-title">DADOS DO PRODUTO</h1>
  
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row product-crud-inputs-container">
            <div className="col-lg-6 product-crud-input-left-container">
              <div className="margin-botton-30">
                <div className="mb-4">
                  <input
                    {...register('name', {
                      required: 'Campo obrigatório',
                    })}
                    type="text"
                    className={`form-control base-input ${
                      errors.name ? 'is-invalid' : ''
                    }`}
                    placeholder="Nome do produto"
                    name="name"
                  />
                  <div className="invalid-feedback d-block">
                    {errors.name?.message}
                  </div>
                </div>
                <div className="margin-botton-30">
                  <Controller
                    name="categories"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={selectCategories}
                        classNamePrefix="product-crud-select"
                        isMulti
                        getOptionLabel={(category: Category) => category.name}
                        getOptionValue={(category: Category) =>
                          String(category.id)
                        }
                      />
                    )}
                  />
                  {errors.categories && (
                    <div className="invalid-feedback d-block">
                      Campo obrigatório
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <Controller 
                  name="price"
                  rules={{required: true}}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                    placeholder='Preço'
                    className={`form-control base-input ${
                      errors.price ? 'is-invalid' : ''
                    }`}
                    disableGroupSeparators={true}
                    value={field.value}
                    onValueChange={field.onChange}
                    />
                  )}
                  />
                  <div className="invalid-feedback d-block">
                    {errors.price?.message}
                  </div>
                </div>
  
                <div className="mb-4">
                  <input
                    {...register('imgUrl', {
                      required: 'Campo obrigatório',
                      pattern: {
                        value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                        message: 'É preciso inserir uma Url válida'
                      }
                    })}
                    type="text"
                    className={`form-control base-input ${
                      errors.imgUrl ? 'is-invalid' : ''
                    }`}
                    placeholder="Url da imagem do produto"
                    name="imgUrl"
                  />
                  <div className="invalid-feedback d-block">
                    {errors.imgUrl?.message}
                  </div>
                </div>
              </div>
            </div>
  
            <div className="col-lg-6">
              <div>
                <textarea
                  rows={10}
                  {...register('description', {
                    required: 'Campo obrigatório',
                  })}
                  className={`form-control base-input h-auto ${
                    errors.description ? 'is-invalid' : ''
                  }`}
                  placeholder="Descrição"
                  name="description"
                />
                <div className="invalid-feedback d-block">
                  {errors.description?.message}
                </div>
              </div>
            </div>
          </div>
  
          <div className="product-crud-buttons-container">
            <button
              className="btn btn-outline-danger product-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary product-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
  

export default Form;
