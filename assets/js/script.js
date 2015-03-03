$(function() {

  var Cache = {
    isAvailable: function () {
      return (undefined !== window.sessionStorage);
    },
    save : function (key, data) {
      if (!this.isAvailable()) {
        return;
      }

      window.sessionStorage.setItem(key, JSON.stringify(data));
    },
    load: function(key) {
      if (!this.isAvailable()) {
        return;
      }

      var content = window.sessionStorage.getItem(key);
      if ('null' == content) {
        return null;
      }

      return JSON.parse(content);
    }
  };

  var catalog = {
    "components" : [
      "Config",
      "Data",
      "Relational",
      "Rest",
      "Template",
      "Validation"
    ],
    "addons": [
      "RespectCouscous",
      "RespectValidationBundle"
    ],
    "tools": [
      "Foundation"
    ]
  };

  var createBlocks = function (repositories)
  {
    $.each(repositories, function (i, repository) {

      var weight_push       = 1,
          weight_stargazers = 5000000;

      repository.created_at = new Date(repository.created_at);
      repository.pushed_at  = new Date(repository.pushed_at);
      repository.updated_at = new Date(repository.updated_at);
      repository.swagger    = repository.pushed_at.getTime() * weight_push;
      repository.swagger    += repository.stargazers_count * weight_stargazers;

      $.each(catalog, function (section) {
        if (-1 == catalog[section].indexOf(repository.name)) {
          return;
        }
        repository.section = section;
      });
    });

    // Sort by most-recently pushed to.
    repositories.sort(function (a, b) {
      if (a.swagger < b.swagger) {
        return 1;
      }

      if (b.swagger < a.swagger) {
        return -1;
      }

      return 0;
    });

    $.each(repositories, function (i, repository) {
      // console.info(repository.name);
      var content = '<div class="col-sm-6 col-md-4">' +
                    '  <div class="thumbnail">' +
                    '    <div class="caption">' +
                    '      <h3 class="trans">' + repository.name + '</h3>' +
                    '      <p class="trans">' + repository.description + '</p>' +
                    '    </div>' +
                    '    <div class="buttons">' +
                    '      <p>' +
                    '        <a href="'+ repository.html_url + '" class="btn btn-default trans" role="button">Repository</a>';

      if (repository.homepage) {
        content += '  <a href="'+ repository.homepage + '" class="btn btn-default trans" role="button">Documentation</a>';
      }

      content +=     '      </p>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
      $('#'+repository.section + ' .row').append(content);
    });
  }

  var repositories = Cache.load("repositories");
  if (repositories) {
    createBlocks(repositories);
  } else {
    $.getJSON("https://api.github.com/users/Respect/repos?callback=?", function (result) {
      repositories = result.data;

      createBlocks(repositories);

      Cache.save("repositories", repositories);
    });
  }

  var messages = {
    "pt-br" : {
      "A conventional project tool for PHP and git.": "Ferramenta para convenção de projetos PHP e Git",
      "A fluent, intuitive ORM for any relational database engine": "Uma ORM fluente e intuitivo para qualquer banco de dados relacional",
      "A powerful, small, deadly simple configurator and dependency injection container DSL made to be easy": "Um poderoso, pequeno e muito simples dependency injection container com uma DSL feita para ser simples de usar",
      "A Respect\\Validation Bundle for Symfony": "Um Respect\\Validation Bundle para Symfony",
      "Add-ons": "Extensões",
      "All our packages are available on": "Todos os nossos pacotes estão disponíveis no",
      "Articles": "Artigos",
      "Components": "Componentes",
      "Create an issue on the GitHub repository of the component you're using": "Crie uma issue no repositório do GitHub do projeto que você está utilizando",
      "Documentation": "Documentação",
      "Experimental, HTML-only templating engine": "Template engine experimental que funciona apenas com HTML",
      "First of all, read our documentations": "Em primeiro lugar, leia nossas documentações",
      "Icon pack by": "Pacote de ícones por",
      "Installation": "Instalação",
      "on": "em",
      "Persistence simplified": "Persistência simplificada",
      "Repository": "Repositório",
      "Respect - Simple independent components for building or improving PHP applications": "Respect - Componentes simples e independentes para construção e melhoria de aplicações PHP",
      "See our IRC channel": "Visite nosso canal no IRC",
      "See us on GitHub": "Visite-nos no GitHub",
      "Simple independent components for building or improving PHP applications": "Componentes simples e independentes para construção e melhoria de aplicações PHP",
      "Support": "Suporte",
      "The Couscous template for Respect projects": "Template do Couscous para os projetos do Respect",
      "The most awesome validation engine ever created for PHP": "O mais incrível mecanismo de validação já criado para PHP",
      "Thin controller for RESTful applications": "Controller para aplicações RESTful",
      "to install them use": "para instalá-los use",
      "Tools": "Ferramentas"
    }
  };

  var translate = function (locale)
  {
    if (locale == "en") {
      restoreTranslation();
      return;
    }

    if (!messages[locale]) {
      return;
    }

    $(".trans").each(function () {
      var element = $(this);
      var content = element.attr("data-content") || element.html();
      if (!messages[locale][content]) {
        return;
      }

      if (!element.attr("data-content")) {
        element.attr("data-content", content);
      }

      element.html(messages[locale][content]);
    });
  };

  var restoreTranslation = function ()
  {
    $(".trans").each(function () {
      var element = $(this);
      var content = element.attr("data-content");

      if (!content) {
        return [];
      }

      element.html(content);
    });
  };

  var settings = Cache.load("settings") || {};

  if (settings.locale) {
    translate(settings.locale);
    $("#language").val(settings.locale);
  }

  $("#language").change(function() {
    var locale = $(this).val();

    translate(locale);

    settings.locale = locale;

    Cache.save("settings", settings);
  });

});
