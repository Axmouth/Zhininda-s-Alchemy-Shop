using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using Identity.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Zhinindas_Alchemy_Shop.Data;
using Zhinindas_Alchemy_Shop.Data.interfaces;
using Zhinindas_Alchemy_Shop.Data.Models;
using Zhinindas_Alchemy_Shop.Data.Repositories;
using Zhinindas_Alchemy_Shop.Options;
using Zhinindas_Alchemy_Shop.Filters;
using FluentValidation.AspNetCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Zhinindas_Alchemy_Shop.Services.Interfaces;
using Zhinindas_Alchemy_Shop.Services.Implementations;
using Zhinindas_Alchemy_Shop.Helpers;
using Zhinindas_Alchemy_Shop.Services;
using Zhinindas_Alchemy_Shop.Data.Interfaces;

namespace Zhinindas_Alchemy_Shop
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public IConfiguration Configuration { get; }

        public Startup(IHostEnvironment hostEnvironment)
        {
            Configuration = new ConfigurationBuilder().SetBasePath(hostEnvironment.ContentRootPath).AddJsonFile("appsettings.json", true).AddJsonFile("appsettings.Local.json", true).AddEnvironmentVariables().Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins(
                                                          "https://api.zhinindas.alchemy.shop.axmouth.dev",
                                                          "https://zhinindas.alchemy.shop.axmouth.dev",
                                                          "http://apizhinindas.alchemy.shop.axmouth.dev",
                                                          "http://zhinindas.alchemy.shop.axmouth.dev",
                                                          "http://localhost:3199",
                                                          "http://zhinindas.shop.test",
                                                          "https://zhinindas.shop.test",
                                                          "https://api.zhinindas.shop.test",
                                                          "http://api.zhinindas.shop.test"
                                                          )
                                                  .AllowAnyHeader()
                                                  .AllowAnyMethod()
                                                  .AllowCredentials()
                                                  .SetIsOriginAllowedToAllowWildcardSubdomains()
                                                  ;
                                  });
            });

            services.AddDbContext<AppDbContext>(options => options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Transient);
            services.AddIdentity<AppUser, IdentityRole>().AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

            var jwtSettings = new JwtSettings();
            Configuration.Bind(nameof(jwtSettings), jwtSettings);
            services.AddSingleton(jwtSettings);

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new ValidationFilter());
                // options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
            })
                 .AddJsonOptions(options =>
                 {
                     options.JsonSerializerOptions.IgnoreNullValues = true;
                 })
                 .AddNewtonsoftJson(options =>
                 {
                     options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                     // options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;

                 })
                .AddFluentValidation(mvcConfiguration => mvcConfiguration.RegisterValidatorsFromAssemblyContaining<Startup>())
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                 .AddJsonOptions(options =>
                 {
                     options.JsonSerializerOptions.IgnoreNullValues = true;
                 })
                .AddSessionStateTempDataProvider();

            services.AddRouting(options =>
            {
            });

            services.Configure<ApiBehaviorOptions>(options =>
            {
                // ...
                options.SuppressModelStateInvalidFilter = true;
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
                ValidateIssuer = false,
                ValidateAudience = false,
                RequireExpirationTime = false,
                ValidateLifetime = true
            };

            services.AddSingleton(tokenValidationParameters);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(x =>
                {
                    x.SaveToken = true;
                    x.TokenValidationParameters = tokenValidationParameters;
                });

            services.AddAuthorization(options =>
            {
            });

            services.AddSingleton<IUriService>(provider =>
            {
                var accessor = provider.GetRequiredService<IHttpContextAccessor>();
                var request = accessor.HttpContext.Request;
                var absoluteUri = string.Concat(request.Scheme, "://", request.Host.ToUriComponent());
                return new RestfulUriService(absoluteUri, accessor);
            });

            services.AddScoped<IRazorViewToStringRenderer, RazorViewToStringRenderer>();

            services.AddScoped<IMailService>(provider =>
            {
                var renderer = provider.GetRequiredService<IRazorViewToStringRenderer>();
                EmailSettings emailSettings = new EmailSettings();
                Configuration.GetSection(nameof(EmailSettings)).Bind(emailSettings);
                return new MailService(emailSettings, renderer);
            });

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@'";
                options.User.RequireUniqueEmail = true;
            });

            services.AddTransient<IMerchandiseRepository, MerchandiseRepository>();
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IOrderRepository, OrderRepository>();
            services.AddTransient<IOrderDetailRepository, OrderDetailRepository>();
            services.AddTransient<IEffectRepository, EffectRepository>();
            services.AddTransient<IAccountService, AccountService>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped(sp => ShoppingCart.GetCart(sp));
            services.AddSwaggerGen(x =>
            {
                x.SwaggerDoc("v1", new OpenApiInfo { Title = "Dragonfly Tracker API", Version = "v1" });

                x.ExampleFilters();

                x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the bearer scheme",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    BearerFormat = "Bearer",
                });
                x.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {new OpenApiSecurityScheme{Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }}, new List<string>()}
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                x.IncludeXmlComments(xmlPath);
            });

            services.AddSwaggerExamplesFromAssemblyOf<Startup>();

            services.AddMemoryCache();
            services.AddSession();


            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.Headers["Location"] = context.RedirectUri;
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });
            services.AddAutoMapper(typeof(Startup));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSession();

            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();

            app.UseAuthorization();
            app.UseCors(builder =>
            {
                builder.WithOrigins("http://*.axmouth.dev", "https://*.axmouth.dev", "http://localhost")
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowCredentials()
                            .SetIsOriginAllowed((host) => true)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers().RequireCors(MyAllowSpecificOrigins);
            });

            Dbinitializer.Seed(serviceProvider);
        }
    }
}
