ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'
 
Vagrant.configure("2") do |config|
  config.vm.define "descant_instance" do |a|
    a.vm.provider "docker" do |d|
      d.build_dir = "."
      d.build_args = ["-t=descant_img"]
      d.ports = ["8001:8001"]
      d.name = "descant_instance"
      d.remains_running = true
      d.cmd = ["gunicorn", "--bind", "0.0.0.0:8001", "descant.wsgi"]
      d.volumes = []
    end
  end
end
