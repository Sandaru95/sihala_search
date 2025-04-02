from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.views import generic
from .forms import User_Form

from .models import Signal_User_Profile


class IndexView(generic.TemplateView):
    template_name = 'accounts/index.html'


class UserSignUpView(generic.View):
    form_class = User_Form
    template_name = 'accounts/signup.html'

    # display a blank form
    def get(self, request):
        return render(request, self.template_name, {})

    #process form data
    def post(self, request):
        form = self.form_class(request.POST) #Now the form is filled with the user data submitted by unknown
        print(request.POST)
        if form.is_valid():
            print('form valid')
            user = form.save(commit=False)

            #clean normalized data
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()
            new_signal_profile = Signal_User_Profile()
            new_signal_profile.name = username
            new_signal_profile.user_linked = user
            new_signal_profile.save()
            # returns User objects if credentials are correct
            user = authenticate(username=username, password=password)

            if user is not None:

                if user.is_active:
                    login(request, user)
                    return redirect('search:index')

        else:
            return redirect('accounts:signup')

class UserLoginView(generic.View):
    template_name = 'accounts/login.html'
    form_class = AuthenticationForm

    def post(self, request):
        form = self.form_class(data=request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('search:index')
        else:
            return render(request, self.template_name)

    def get(self, request):
        return render(request, self.template_name, {})

class UserLogoutView(generic.View):
    def get(self, request):
        logout(request)
        return render(request, 'accounts/logout.html')
