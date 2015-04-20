class Ld32Controller < ApplicationController
  def index
    render 'index', layout: false
  end
  after_action :allow_iframe, only: :index

private
  def allow_iframe
    response.headers.except! 'X-Frame-Options'
  end
end
