# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  root to: "main#index"
  get "/about", to: "about#index"
  get "/sign-up", to: "registrations#new"
  post "/sign-up", to: "registrations#create"
  delete "/logout", to: "sessions#destroy"
end
