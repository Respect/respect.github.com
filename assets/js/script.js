$(function () {

  var Cache = {
    isAvailable: function () {
      return (undefined !== window.sessionStorage);
    },
    save: function (key, data) {
      if (!this.isAvailable()) {
        return;
      }

      window.sessionStorage.setItem(key, JSON.stringify(data));
    },
    load: function (key) {
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

  var githubRequest = function (uri, callback) {
    var url   = "https://api.github.com" + uri;
    var data  = Cache.load(uri);
    if (data) {
      callback.call(null, data);
      return;
    }

    $.ajax({
      "url": url,
      "async": false,
      "dataType": "json",
      "success": function (data) {
        callback.call(null, data);

        Cache.save(uri, data);
      }
    });
  }

  var sections = {
    "components": [
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

  var createBlocks = function (data) {
    var repositories = [];
    $.each(data, function (index, repository) {

      $.each(sections, function (section) {
        if (-1 == sections[section].indexOf(repository.name)) {
          return;
        }

        repository.section = section;
      });

      if (!repository.section) {
        return;
      }

      var weight_push       = 1,
          weight_stargazers = 5000000;

      repository.created_at = new Date(repository.created_at);
      repository.pushed_at  = new Date(repository.pushed_at);
      repository.updated_at = new Date(repository.updated_at);
      repository.swagger    = repository.pushed_at.getTime() * weight_push;
      repository.swagger    += repository.stargazers_count * weight_stargazers;

      githubRequest("/repos/Respect/" + repository.name + "/tags", function (tags) {
        var versions = [];

        $.each(tags, function (i, tag) {
          versions.push(tag.name);
        });

        versions.sort(function (a, b) {
          var a_pieces = a.split('.');
          var b_pieces = b.split('.');

          for (var i = 0; i < a_pieces.length; ++i) {
            if (a_pieces[i] == b_pieces[i]) {
              continue;
            }

            if (a_pieces[i] > b_pieces[i]) {
              return -1;
            }

            return 1;
          }

          return 0;
        });

        repository.version = versions.shift();
      });

      repositories.push(repository);
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
      var content = '<div class="col-sm-6 col-md-4">' +
                      '<div class="thumbnail">' +
                        '<div class="caption">' +
                          '<h3 class="trans">' +
                            repository.name +
                            (repository.version ? ' <small>' + repository.version + '</small>' : '') +
                          '</h3>' +
                          '<p class="trans">' + repository.description + '</p>' +
                        '</div>' +
                        '<div class="buttons">' +
                          '<p>' +
                            '<a href="' + repository.html_url + '" class="btn btn-default btn-sm trans" role="button">Repository</a>' +
                            (repository.homepage ? ' <a href="' + repository.homepage + '" class="btn btn-default btn-sm trans" role="button">Documentation</a>' : '') +
                          '</p>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
      $('#' + repository.section + ' .row').append(content);
    });
  }

  githubRequest("/users/Respect/repos", createBlocks);

  var messages = {
    "pt-br": {
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
    },
    "fr-fr": {
      "A conventional project tool for PHP and git.": "Outil pour PHP projets de Convention et Git",
      "A fluent, intuitive ORM for any relational database engine": "Un ORM fluent et intuitif pour tout relationnelle base de données",
      "A powerful, small, deadly simple configurator and dependency injection container DSL made to be easy": "Un conteneur d'injection puissant, petit et très simple avec une ligne DSL est conçu pour être simple à utiliser",
      "A Respect\\Validation Bundle for Symfony": "Un Bundle Respect\\Validation pour Symfony",
      "Add-ons": "Extensions",
      "All our packages are available on": "Tous nos forfaits sont disponibles dans la",
      "Articles": "Articles",
      "Components": "Composants",
      "Create an issue on the GitHub repository of the component you're using": "Créer un issue sur le référentiel du projet que vous utilisez GitHub",
      "Documentation": "Documentation",
      "Experimental, HTML-only templating engine": "Moteur de template expérimental ne fonctionne qu'avec HTML",
      "First of all, read our documentations": "Tout d'abord, lisez notre documentation",
      "Icon pack by": "Pack d'icônes pour",
      "Installation": "Installation",
      "on": "dans",
      "Persistence simplified": "Persistance simplifiée",
      "Repository": "Référentiel",
      "Respect - Simple independent components for building or improving PHP applications": "Respect - simple et indépendantes des composants pour la construction et l'amélioration des applications PHP",
      "See our IRC channel": "Visitez notre chaîne sur IRC",
      "See us on GitHub": "Visitez-nous sur GitHub",
      "Simple independent components for building or improving PHP applications": "Simples et indépendantes des composants pour la construction et l'amélioration des applications PHP",
      "Support": "Prise en charge",
      "The Couscous template for Respect projects": "Modèle du Couscous selon les plans de Respect",
      "The most awesome validation engine ever created for PHP": "Le moteur de validation plus incroyable jamais créé pour PHP",
      "Thin controller for RESTful applications": "Contrôleur pour les applications RESTful",
      "to install them use": "pour installer leur utilisation",
      "Tools": "Outils"
    }      
  };

  var translate = function (locale) {
    if (locale == "en") {
      translateRestore();
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

  var translateRestore = function () {
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

  $("#language").change(function () {
    var locale = $(this).val();

    translate(locale);

    settings.locale = locale;

    Cache.save("settings", settings);
  });

});
