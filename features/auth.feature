Feature: Authentication
    In order to manage personal information
    As a user of the tool
    I want to be able to register, login, and logout
    @wip
    Scenario: Register new user
        When I visit the "home" page
        And the page is loaded
        And I register as a "bmarshall@example.com"
        Then I should be logged in as "bmarshall@example.com"