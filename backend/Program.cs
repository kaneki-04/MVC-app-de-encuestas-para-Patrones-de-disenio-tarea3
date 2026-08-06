using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using GestorEncuestas_MVC.Data;
using GestorEncuestas_MVC.Models;
using GestorEncuestas_MVC.Services;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Servicios MVC
builder.Services.AddControllersWithViews();

builder.Services.AddScoped<IExcelExportService, ExcelExportService>();

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    });


// CORS React
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});


// Entity Framework MySQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    ));


// Identity
builder.Services.AddIdentity<Usuario, Rol>(options =>
{
    // Password
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Usuario
    options.User.RequireUniqueEmail = false;

    // Bloqueo
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // Login
    options.SignIn.RequireConfirmedAccount = false;
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedPhoneNumber = false;

})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();


// Cookies
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);

    options.LoginPath = "/Cuenta/Login";
    options.AccessDeniedPath = "/Cuenta/AccessDenied";
    options.LogoutPath = "/Cuenta/Logout";

    options.SlidingExpiration = true;
});


// Autorización
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin",
        policy => policy.RequireRole("Admin"));

    options.AddPolicy("RequireUser",
        policy => policy.RequireRole("User", "Admin"));
});


// Sesiones
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
});


var app = builder.Build();


// Pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("ReactApp");


// IMPORTANTE
app.UseAuthentication();

app.UseSession();

app.UseAuthorization();


app.MapControllers();


// Inicialización de roles y usuarios
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();

    var roleManager =
        scope.ServiceProvider.GetRequiredService<RoleManager<Rol>>();

    var userManager =
        scope.ServiceProvider.GetRequiredService<UserManager<Usuario>>();


    // Crear roles
    string[] roles =
    {
        "Admin",
        "User"
    };


    foreach (var roleName in roles)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(
                new Rol
                {
                    Name = roleName,
                    NormalizedName = roleName.ToUpper()
                }
            );
        }
    }



    // Crear administrador
    var admin = await userManager.FindByNameAsync("admin");

    if (admin == null)
    {
        var adminRole = await roleManager.FindByNameAsync("Admin");

        var userAdmin = new Usuario
        {
            UserName = "admin",
            Email = "admin@email.com",
            EmailConfirmed = true,
            RolId = adminRole!.Id
        };


        var result =
            await userManager.CreateAsync(
                userAdmin,
                "Admin123!"
            );


        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(
                userAdmin,
                "Admin"
            );
        }
    }



    // Crear usuario Kevin
    var kevin =
        await userManager.FindByNameAsync("Kevin");


    if (kevin == null)
    {
        var userRole = await roleManager.FindByNameAsync("User");

        var userKevin = new Usuario
        {
            UserName = "Kevin",
            Email = "kevin@prueba.com",
            EmailConfirmed = true,
            RolId = userRole!.Id
        };


        var result =
            await userManager.CreateAsync(
                userKevin,
                "123Qwe"
            );


        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(
                userKevin,
                "User"
            );
        }
    }
}



app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Cuenta}/{action=Login}/{id?}"
);


app.Run();