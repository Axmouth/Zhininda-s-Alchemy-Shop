#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src
COPY ["Zhininda\\'s Alchemy Shop/Zhininda\\'s Alchemy Shop.csproj", "Zhininda\\'s Alchemy Shop/"]
RUN dotnet restore "Zhininda's Alchemy Shop/Zhininda's Alchemy Shop.csproj"
COPY . .
WORKDIR "/src/Zhininda's Alchemy Shop"
RUN dotnet build "Zhininda's Alchemy Shop.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Zhininda's Alchemy Shop.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "/app/Zhinindas Alchemy Shop.dll"]