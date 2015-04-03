require 'test_helper'

class Api::BoardControllerTest < ActionController::TestCase

  #One of the hazards of relying too heavily on helpers..
  Api::BoardController.class_eval do
    def huboard
      board = Object.new()
      board.class_eval do
        def board(user, repo); end
      end
      board
    end
    def authorization_level; end
    def logged_in?; end
  end

  test 'health_check' do
    #Setup
    payload = [{
      'name' => 'some_health_check',
      'success'=> true
    }]
    mock_doctor = mock('Doctor Instance')
    mock_doctor.stubs(:check).returns(payload)

    HealthChecking::BoardExam.stubs(:new)
    HealthChecking::Doctor.stubs(:new).returns(mock_doctor)

    #Run
    get :health_check, user: 'test_user', repo: 'test_repo'

    #Assert
    assert_response :success
    assert_equal(payload, JSON.parse(response.body))
  end
end
