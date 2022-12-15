

&nbsp;

### Info about the API

&nbsp;



&nbsp;

>**Sign up a user**
>
> Method: `POST`
>
> URL: `localhost:9000/api/v1/auth/signup`
>
> Access: `Public`
> 
> Request body's property (Required):
>> `username`, `email`, `password`, `passwordConfirm`
>
> Request body's property (Optional):
>> `role`




&nbsp;

>**Login a user**
>
> Method: `POST`
>
> URL: `localhost:9000/api/v1/auth/login`
>
> Access: `Public`
> 
> Request body's property (Required):
>> `email`, `password`



&nbsp;

>**Get all the users' info**
>
> Method: `GET`
>
> URL: `localhost:9000/api/v1/user/`
>
> Access: `Private (Only admin)`



&nbsp;

>**Get a specific users' info**
>
> Method: `GET`
>
> URL: `localhost:9000/api/v1/user/:id`
>
> Access: `Private (Admin & and only the user himself)`
>
>Parameters (Required): 
>>The `id` parameter is the mongoDB `_id` property of the user.




&nbsp;

>**Fetch all the products**
>
> Method: `GET`
>
> URL: `localhost:4000/api/v1/product`
>
> Access: `Public`


&nbsp;

>**Fetch a specific product**
>
> Method: `GET`
>
> URL: `localhost:4000/api/v1/product/:id`
>
> Access: `Public`
>
>Parameters (Required): 
>>The `id` parameter is the mongoDB `_id` property of the product.




&nbsp;

>**Create a new product**
>
> Method: `POST`
>
> URL: `localhost:4000/api/v1/product/`
>
> Access: `Public`
>
> Request body's property (Required):
>> `user_id`, `title`, `description`, `price`
>
>Note about image `user_id`:
>> We need to know which user has created a product. If we know that, then we will able to provide that user the option to edit and delete the product. That's why we are having the `user_id` property here.



&nbsp;

>**Delete a specific product**
>
> Method: `POST`
>
> URL: `localhost:4000/api/v1/product/:id`
>
> Access: `Public`
>
>Parameters (Required): 
>>The `id` parameter is the mongoDB `_id` property of the product.


&nbsp;

>**Update a specific product**
>
> Method: `PATCH`
>
> URL: `localhost:4000/api/v1/product/:id`
>
> Access: `Public`
>
>Parameters (Required): 
>>The `id` parameter is the mongoDB `_id` property of the product.
>
>Request body's property:
>> `title`, `description`, `price`


&nbsp;



