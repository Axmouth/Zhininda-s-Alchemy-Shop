namespace Zhinindas_Alchemy_Shop.Contracts.V1
{
    public static class ApiRoutes
    {
        public const string Root = "api";
        public const string Version = "v1";
        public const string Base = Root + "/" + Version;

        public static class Posts
        {
            public const string GetAll = Base + "/posts";
            public const string Update = Base + "/posts/{postId}";
            public const string Delete = Base + "/posts/{postId}";
            public const string Get = Base + "/posts/{postId}";
            public const string Create = Base + "/posts";
        }
        
        public static class Tags
        {
            public const string GetAll = Base + "/tags";            
            public const string Get = Base + "/tags/{tagName}";            
            public const string Create = Base + "/tags";            
            public const string Delete = Base + "/tags/{tagName}";

            public static class Tags2
            {
                public const string GetAll = Tags.Get + "/tags";
                public const string Get = Tags.Get + "/tags/{tagName}";
                public const string Create = Tags.Get + "/tags";
                public const string Delete = Tags.Get + "/tags/{tagName}";
            }
        }

        public static class Merchandises
        {
            public const string GetAll = Base + "/merchandises";
            public const string Update = Base + "/merchandises/{merchandiseId}";
            public const string Delete = Base + "/merchandises/{merchandiseId}";
            public const string Get = Base + "/merchandises/{merchandiseId}";
            public const string Create = Base + "/merchandises";
        }

        public static class Categories
        {
            public const string GetAll = Base + "/categories";
            public const string Update = Base + "/categories/{categoryId}";
            public const string Delete = Base + "/categories/{categoryId}";
            public const string Get = Base + "/categories/{categoryId}";
            public const string Create = Base + "/categories";
        }

        public static class Orders
        {
            public const string GetAll = Base + "/orders";
            public const string Update = Base + "/orders/{orderId}";
            public const string Delete = Base + "/orders/{orderId}";
            public const string Get = Base + "/orders/{orderId}";
            public const string Create = Base + "/orders";
        }

        public static class OrderDetails
        {
            public const string GetAll = Base + "/order-details";
            public const string Update = Base + "/order-details/{orderDetailId}";
            public const string Delete = Base + "/order-details/{orderDetailId}";
            public const string Get = Base + "/order-details/{orderDetailId}";
            public const string Create = Base + "/order-details";
        }

        public static class Account
        {
            public const string Register = Base + "/account/register";
            public const string Login = Base + "/account/login";
            public const string Refresh = Base + "/account/refresh";
            public const string Logout = Base + "/account/logout";
            public const string Profile = Base + "/account/profile";
            public const string GetSettings = Base + "/account/settings";
            public const string UpdateSettings = Base + "/account/settings";
        }

        public static class ShoppingCart
        {
            public const string GetAll = Base + "/shopping-cart";
            public const string Add = Base + "/shopping-cart/{merchandiseId}";
            public const string Remove = Base + "/shopping-cart/{merchandiseId}";
            public const string Update = Base + "/shopping-cart/{merchandiseId}";
        }

    }
}