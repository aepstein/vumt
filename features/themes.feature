Feature: Manage themes
    In order to restrict advisories to geographic areas
    As an administrator of the system
    I want to be able to create, modify, and delete themes

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a theme "Safety" exists

    Scenario: See themes
        Given I logged in as "bmcmartin@example.com"
        When I visit the "themes" page
        Then I should see theme "Safety"

    Scenario: Search themes with pagination
        Given I logged in as "bmcmartin@example.com"
        And 10 themes exist
        And a theme "special theme" exists
        When I visit the "themes" page
        And I fill in "Search" with "theme"
        Then I should see themes 2 through 12
        And I should not see theme "special theme"
        When I click the "More" button
        And there is no spinner
        Then I should see themes 2 through 13
        And I should not see theme "Safety"

    Scenario: Edit a theme
        Given I logged in as "bmcmartin@example.com"
        When I visit the "themes" page
        And I click "Edit" for theme "Safety"
        And I fill in "Name" with "Knowledge"
        And I choose "warning" for "Color"
        And I click the "Update theme" button
        And I click "Detail" for theme "Knowledge"
        Then I should see "Name" defined as "Knowledge"
        And I should see "Color" defined as "warning"

    Scenario Outline: Try to add invalid theme
        Given I logged in as "bmcmartin@example.com"
        When I visit the "themes" page
        And I click the "Add theme" button
        And I fill in values for the theme except "<field>"
        And I click the "Add theme" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field |
            | Name  |

    Scenario: Remove a theme
        Given I logged in as "bmcmartin@example.com"
        When I visit the "themes" page
        And I click "Remove" for theme "Safety"
        Then I wait for theme "Stay Safe" to disappear

    Scenario: Try to remove a theme associated with an advisory
        Given I logged in as "bmcmartin@example.com"
        And an advisory "Local" exists
        And the advisory "Local" has theme "Safety"
        When I visit the "themes" page
        And I click "Remove" for theme "Safety"
        Then I should see a notice "Cannot remove the theme because it is part of theme in a dependent advisory"
        And I should see theme "Safety"
